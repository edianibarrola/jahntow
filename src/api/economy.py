"""
Server-side, authoritative game economy: market prices, passive regen/
production, mission resolution, and levelling. Every player action that
changes credits, stats, inventory, or experience is computed here instead
of trusting values sent by the client.
"""
import random
from datetime import timedelta

from api.models import (
    db, MarketPrice, MarketPriceHistory, GameEvent, ActivityLogEntry,
    XP_PER_LEVEL, utcnow,
)
from api import game_data

# How often shared market prices are allowed to drift, and by how much.
PRICE_TICK_INTERVAL = timedelta(seconds=30)
# Baseline drift is deliberately gentle. At the old +/-10% per tick the
# random walk reached a ~26% standard deviation over 10 minutes, which
# completely swallowed the 20-40% price events - an "event" was
# statistically indistinguishable from ordinary noise, so it never felt
# like anything was happening.
PRICE_DRIFT_PCT = 0.035
PRICE_REVERT_THRESHOLD_PCT = 0.35  # snap back to base once drifted this far
# Buy above mid, sell below it. Without a spread, buy and sell used the
# identical price, so a round trip was free and "buy under base, sell over
# base" was risk-free money against a bounded mean-reverting price the
# server also broadcasts moves for. The spread makes a position cost
# something to be wrong about.
MARKET_SPREAD_PCT = 0.05

# Passive regen/production ticks, applied lazily based on elapsed time.
# Each has its own last-applied timestamp on Player so sub-tick remainders
# carry forward instead of being discarded (see _consume_ticks).
ENERGY_REGEN_INTERVAL = timedelta(seconds=10)
ENERGY_REGEN_AMOUNT = 1
# Health regenerates far slower than energy: it's the resource that gates
# risk-taking, so recovering it should cost real time (or credits, via
# Medlab) rather than being free.
HEALTH_REGEN_INTERVAL = timedelta(seconds=45)
HEALTH_REGEN_AMOUNT = 1
PROPERTY_PRODUCTION_INTERVAL = timedelta(seconds=30)
# Properties keep producing past maxInventoryCount up to this multiple of
# it, so a high-rate property isn't throttled to near-zero output the
# moment its stock fills. Bounded so it can't accumulate without limit.
PRODUCTION_OVERFLOW_MULTIPLE = 5
# Longest absence that still accrues production, so returning after a week
# doesn't dump an unsellable mountain of stock.
PRODUCTION_CAP_HOURS = 8

# XP_PER_LEVEL is imported from models (Player.serialize needs it too).
# Credits granted per level gained.
LEVEL_UP_CREDIT_BONUS = 1000
# A failed mission refunds most of its entry cost. The real price of
# failure is the energy, the health, and the consumed equipment - not the
# fee. Charging the full non-refundable entry on a coin flip meant a
# fresh player with 5000 credits got 5 attempts and had a ~7% chance of
# going broke before their first win, with no way back.
MISSION_FAILURE_REFUND_PCT = 0.6
# Max health/energy also grow with level, so session length doesn't
# collapse as mission energy costs scale up with rank.
MAX_ENERGY_PER_LEVEL = 5
MAX_HEALTH_PER_LEVEL = 3
# Experience falls off for missions well below the player's level, so
# grinding out-levelled content stops being the optimal way to level.
XP_FALLOFF_PER_LEVEL = 0.12
XP_FALLOFF_FLOOR = 0.15

# Credits trickle in while offline (or just idle), same elapsed-time-based
# mechanism as energy regen/property production, capped so leaving the game
# open for days doesn't accrue an unbounded amount. Expressed as an
# interval-per-credit so it uses the same whole-ticks-with-carry machinery
# as the other resources - the old int(hours * rate) form floored to zero
# on every poll shorter than the per-credit interval, i.e. always.
OFFLINE_TRICKLE_CREDITS_PER_HOUR = 25
OFFLINE_TRICKLE_INTERVAL = timedelta(seconds=3600 / OFFLINE_TRICKLE_CREDITS_PER_HOUR)
OFFLINE_TRICKLE_CAP_HOURS = 8

# How many price points to retain per item for the market chart. At one
# tick per PRICE_TICK_INTERVAL (30s) this is ~30 minutes of history.
PRICE_HISTORY_POINTS = 60

# Daily login streak bonus, capped so it plateaus instead of growing forever.
STREAK_BONUS_PER_DAY = 50
STREAK_BONUS_CAP_DAYS = 10

# Highest "Rank"/"Required Level" that appears anywhere in the catalog
# (items, missions, story missions) - the level at which a player has
# reached the top of everything the game currently offers, and the gate
# for prestiging.
MAX_LEVEL = 50

# Permanent, additive stat bump per prestige level, applied on top of the
# base 100/100/10 floor. Deliberately bigger than a single upgrade
# purchase (UPGRADE_STAT_STEP = 5) so a rebirth feels like a real
# milestone, not just one more upgrade click.
PRESTIGE_MAX_HEALTH_BONUS = 20
PRESTIGE_MAX_ENERGY_BONUS = 20
PRESTIGE_MAX_INVENTORY_BONUS = 5
PRESTIGE_MAX_EQUIPMENT_BONUS = 10

# Mission success chance scales with how prepared the player actually is,
# instead of being a flat coin flip regardless of level or gear:
#   - BASE_SUCCESS_CHANCE is what you get right at a mission's own rank
#     (still a real risk - the mission is new to you).
#   - Each level above the mission's rank improves your odds; each level
#     below (possible for story missions, which aren't level-gated)
#     worsens them.
#   - Owning more than the bare minimum of required equipment also helps,
#     capped so gear alone can't trivialize a mission.
#   - Attempting a mission at its own rank is now a genuine coin-flip-ish
#     gamble rather than a comfortable win. Combined with the reward curve
#     below, running *at* your level is the risky-but-lucrative play and
#     dropping a few ranks is the safe-but-slower one - which is the
#     decision the loop previously didn't have, since every mission used to
#     be safely +EV and higher ranks were paradoxically *safer* bets.
BASE_SUCCESS_CHANCE = 0.48
SUCCESS_PER_LEVEL_ADVANTAGE = 0.035
SUCCESS_PER_EXTRA_EQUIPMENT = 0.02
# Spare gear is worth stockpiling further than it used to be: the old
# +0.10 cap saturated at 5 spares, so a player who bought 17 of something
# saw no change past the 6th and no explanation why. Still capped, but the
# cap is now surfaced in the mission card so it's a visible ceiling rather
# than a silent one.
MAX_EQUIPMENT_BONUS = 0.20
# Out-levelling a mission helps, but only so far - every mission keeps an
# irreducible risk. Uncapped, a level-50 player farming rank-36 content sat
# at a 0.91 success rate, which made trivial content the best credits per
# energy in the game and the capstone mission pointless.
MAX_LEVEL_ADVANTAGE_BONUS = 0.22
MIN_SUCCESS_CHANCE = 0.10
MAX_SUCCESS_CHANCE = 0.92

# Random, temporary category-wide price events, layered on top of the
# normal per-item random walk. Rolled lazily whenever prices are checked
# (same request-driven pattern as everything else - no scheduler), gated
# by a cooldown so events don't chain back to back.
EVENT_CHECK_COOLDOWN = timedelta(minutes=4)
EVENT_SPAWN_CHANCE = 0.15
# Several events can run at once, but only one per category.
MAX_CONCURRENT_EVENTS = 3
# Short and violent rather than long and mild. A 15-minute +25% move was
# both easy to miss and easy to mistake for drift; a 3-minute +80% move is
# an obvious, actionable window you have to react to.
EVENT_DURATION_MIN = timedelta(minutes=2)
EVENT_DURATION_MAX = timedelta(minutes=5)
EVENT_MAGNITUDE_MIN = 0.50
EVENT_MAGNITUDE_MAX = 1.20

# Server-side activity log / notification feed. Player history is capped
# at ACTIVITY_LOG_CAP entries (only ever trimmed on read, rows aren't
# deleted), global price-notification feed at NOTIFICATION_LOG_CAP.
ACTIVITY_LOG_CAP = 50
NOTIFICATION_LOG_CAP = 30
# Minimum cumulative price drift (since the last notification for that
# item) before a "price changed" notification fires.
PRICE_NOTIFY_THRESHOLD = 0.08
# A mission result appends a low-health warning once the player's health
# drops to/below this fraction of their max.
LOW_HEALTH_RATIO = 0.25


def _all_catalog_items():
    for category, items in game_data.ITEMS.items():
        for item_name, data in items.items():
            yield category, item_name, data


def ensure_market_seeded():
    """Create a MarketPrice row for any catalog item that doesn't have one yet."""
    existing = {row.item_name for row in MarketPrice.query.all()}
    created = False
    for category, item_name, data in _all_catalog_items():
        if item_name in existing:
            continue
        db.session.add(MarketPrice(
            item_name=item_name,
            category=category,
            base_cost=data["Base Cost"],
            current_cost=data["Base Cost"],
        ))
        created = True
    if created:
        db.session.commit()


def _record_price_point(price_row, now):
    """
    Append this tick's price to the item's rolling history and trim to the
    most recent PRICE_HISTORY_POINTS. Riding the existing tick means the
    chart needs no separate mechanism, and trimming on write bounds the
    table without a background job.
    """
    db.session.add(MarketPriceHistory(
        item_name=price_row.item_name,
        cost=price_row.current_cost,
        recorded_at=now,
    ))

    stale_ids = [
        row.id for row in
        MarketPriceHistory.query
        .filter_by(item_name=price_row.item_name)
        .order_by(MarketPriceHistory.id.desc())
        .offset(PRICE_HISTORY_POINTS)
        .all()
    ]
    if stale_ids:
        (MarketPriceHistory.query
         .filter(MarketPriceHistory.id.in_(stale_ids))
         .delete(synchronize_session=False))


def get_price_history():
    """Rolling price series per item, oldest first, for the market chart."""
    rows = (
        MarketPriceHistory.query
        .order_by(MarketPriceHistory.item_name, MarketPriceHistory.id.asc())
        .all()
    )
    series = {}
    for row in rows:
        series.setdefault(row.item_name, []).append(row.cost)
    return series


def _tick_price(price_row, now):
    elapsed = now - (price_row.updated_at or now)
    if elapsed < PRICE_TICK_INTERVAL:
        return False

    drift = 1 + (random.random() * 2 - 1) * PRICE_DRIFT_PCT
    new_cost = price_row.current_cost * drift

    if price_row.base_cost > 0 and abs(new_cost - price_row.base_cost) / price_row.base_cost > PRICE_REVERT_THRESHOLD_PCT:
        new_cost = price_row.base_cost

    # Credits are a whole-number currency (Player.credits is an Integer
    # column), so prices stay whole numbers too rather than drifting into
    # fractional cents that would fail to persist on a strict Postgres
    # integer column.
    price_row.current_cost = max(1, round(new_cost))
    price_row.updated_at = now

    _record_price_point(price_row, now)

    # Post a global "price changed" notification once cumulative drift
    # since the last one crosses the threshold - server-side equivalent
    # of what used to be a client-only, page-load-reset baseline dict.
    baseline = price_row.last_notified_cost or price_row.base_cost
    if baseline > 0:
        change = (price_row.current_cost - baseline) / baseline
        if abs(change) >= PRICE_NOTIFY_THRESHOLD:
            pct = round(abs(change) * 100)
            arrow = "▲" if change > 0 else "▼"
            log_notification(
                f"{price_row.item_name} {arrow} {pct}% (now {price_row.current_cost:.1f})",
                "price-up" if change > 0 else "price-down",
            )
            price_row.last_notified_cost = price_row.current_cost

    return True


def apply_price_ticks():
    """Advance any market prices that are due for their next random-walk step."""
    ensure_market_seeded()
    now = utcnow()
    changed = False
    for row in MarketPrice.query.all():
        if _tick_price(row, now):
            changed = True
    if changed:
        db.session.commit()


def apply_event_ticks():
    """
    Maybe roll a new category-wide price event into existence. Same lazy,
    request-driven pattern as apply_price_ticks - called wherever prices
    are read, no scheduler. Returns the full list of currently active
    events.

    Events are now scoped per category: several can run at once on
    *different* categories (up to MAX_CONCURRENT_EVENTS), but never two on
    the same one. Previously a single global event was allowed, and
    get_active_event() returned only the newest row - so if a second event
    ever did exist (the admin panel can create them freely, and there's an
    unlocked read-then-write race here), the older one silently stopped
    applying to prices and vanished from the banner.
    """
    now = utcnow()
    active = get_active_events()

    if len(active) >= MAX_CONCURRENT_EVENTS:
        return active

    busy_categories = {event.category for event in active}
    candidates = [c for c in game_data.ITEMS.keys() if c not in busy_categories]
    if not candidates:
        return active

    # Cooldown is per-category too: a category that just finished an event
    # shouldn't immediately start another, but an untouched category
    # shouldn't be blocked by an unrelated one.
    recent_cutoff = now - EVENT_CHECK_COOLDOWN
    cooling = {
        row.category for row in
        GameEvent.query.filter(GameEvent.ends_at > recent_cutoff).all()
    }
    candidates = [c for c in candidates if c not in cooling]
    if not candidates:
        return active

    if random.random() > EVENT_SPAWN_CHANCE:
        return active

    category = random.choice(candidates)
    kind = random.choice(["price_spike", "price_crash"])
    magnitude = random.uniform(EVENT_MAGNITUDE_MIN, EVENT_MAGNITUDE_MAX)
    # Symmetric in log space: a crash divides where a spike multiplies. A
    # plain (1 - magnitude) would go negative once magnitude exceeds 1.
    multiplier = (1 + magnitude) if kind == "price_spike" else 1 / (1 + magnitude)
    duration = timedelta(seconds=random.uniform(
        EVENT_DURATION_MIN.total_seconds(), EVENT_DURATION_MAX.total_seconds()
    ))

    event = GameEvent(
        kind=kind,
        category=category,
        multiplier=multiplier,
        starts_at=now,
        ends_at=now + duration,
    )
    db.session.add(event)
    db.session.commit()
    return active + [event]


def get_active_events():
    """
    Every event live right now. Also filters on starts_at, which the old
    single-event lookup never checked - so an admin-scheduled future event
    used to take effect immediately.
    """
    now = utcnow()
    return (
        GameEvent.query
        .filter(GameEvent.ends_at > now, GameEvent.starts_at <= now)
        .order_by(GameEvent.id.asc())
        .all()
    )


def get_event_multiplier(category, events=None):
    """
    Combined multiplier for a category. `events` should be a prefetched
    list from get_active_events() - passing it avoids re-querying once per
    market row, which is what the old per-row get_active_event() call did.
    """
    if events is None:
        events = get_active_events()
    multiplier = 1.0
    for event in events:
        if event.category == category:
            multiplier *= event.multiplier
    return multiplier


def get_effective_price(price_row, events=None):
    """
    The mid price right now: the stored current_cost adjusted by any active
    category-wide events. Computed at read time rather than persisted into
    current_cost itself, so an event needs no cleanup when it expires - the
    multiplier just stops applying.
    """
    return price_row.current_cost * get_event_multiplier(price_row.category, events)


def get_buy_price(price_row, events=None):
    """What the player pays per unit - mid plus half the spread."""
    return get_effective_price(price_row, events) * (1 + MARKET_SPREAD_PCT / 2)


def get_sell_price(price_row, events=None):
    """What the player receives per unit - mid minus half the spread."""
    return get_effective_price(price_row, events) * (1 - MARKET_SPREAD_PCT / 2)


def log_activity(player, message, type_="info"):
    """
    Record a player-scoped activity entry - rides along in whatever
    transaction the caller is already about to commit (no commit here).
    """
    entry = ActivityLogEntry(player_id=player.id, message=message, type=type_)
    db.session.add(entry)
    return entry


def log_notification(message, type_):
    """Global entry (player_id=None) - a market-wide event, not tied to any one player."""
    entry = ActivityLogEntry(player_id=None, message=message, type=type_)
    db.session.add(entry)
    return entry


def get_player_activity(player, limit=ACTIVITY_LOG_CAP):
    return (
        ActivityLogEntry.query
        .filter_by(player_id=player.id)
        .order_by(ActivityLogEntry.id.desc())
        .limit(limit)
        .all()
    )


def get_global_notifications(limit=NOTIFICATION_LOG_CAP):
    return (
        ActivityLogEntry.query
        .filter_by(player_id=None)
        .order_by(ActivityLogEntry.id.desc())
        .limit(limit)
        .all()
    )


def get_market_prices():
    apply_price_ticks()
    # Fetch the active events once and reuse them for every row - this used
    # to re-query per row (one SELECT per catalog item, per request).
    events = apply_event_ticks()
    rows = MarketPrice.query.order_by(MarketPrice.category, MarketPrice.item_name).all()
    results = []
    for row in rows:
        serialized = row.serialize()
        serialized["current_cost"] = round(get_effective_price(row, events), 2)
        # Send the actual buy and sell prices, not just the mid. With only
        # the mid shown, the spread made the real cost of a purchase
        # unknowable until after it went through.
        serialized["buy_price"] = int(get_buy_price(row, events))
        serialized["sell_price"] = int(get_sell_price(row, events))
        # Let the UI mark which items are under an active event rather than
        # silently baking the multiplier into the price with no cue.
        serialized["event_multiplier"] = round(get_event_multiplier(row.category, events), 4)
        results.append(serialized)
    return results


def get_item_price(item_name):
    apply_price_ticks()
    apply_event_ticks()
    return MarketPrice.query.filter_by(item_name=item_name).first()


def find_catalog_item(item_name):
    for category, name, data in _all_catalog_items():
        if name == item_name:
            return category, data
    return None, None


def find_equipment(item_name):
    for category, items in game_data.EQUIPMENT.items():
        if item_name in items:
            return category, items[item_name]
    return None, None


def find_property(property_name):
    for category, items in game_data.PROPERTIES.items():
        if property_name in items:
            return category, items[property_name]
    return None, None


def find_recovery_item(item_name):
    for category, items in game_data.HEALTH_RECOVERY_ITEMS.items():
        if item_name in items:
            return category, items[item_name]
    return None, None


def _consume_ticks(player, field, interval, now, cap=None):
    """
    How many whole `interval`s have elapsed for one passive resource,
    advancing that resource's own timestamp by exactly the time consumed.

    The remainder carrying forward is the whole point. Previously every
    resource shared one `last_tick_at` that was reset to `now` regardless
    of how much time was actually used, so any resource whose interval was
    longer than the caller's polling cadence never accumulated anything:
    the frontend polls every 20s, `int(20s / 30s)` is 0 production ticks,
    and the unused 20s was thrown away every single poll. Properties
    produced nothing at all while a tab was open.

    Seeds from the legacy `last_tick_at` the first time a per-resource
    timestamp is NULL (so existing rows work without a data migration) -
    and writes it back immediately. Leaving it NULL to re-derive next time
    would reintroduce the very bug this fixes, because `last_tick_at` is
    itself refreshed on every call: the fallback would always look ~0
    seconds old and no resource would ever accumulate a whole tick.
    """
    last = getattr(player, field, None)
    if last is None:
        last = player.last_tick_at or now
        setattr(player, field, last)

    elapsed = now - last
    if elapsed <= timedelta(0):
        return 0

    if cap is not None and elapsed > cap:
        # Skip over the un-earnable excess (so a week away doesn't bank a
        # week of gains) while still consuming it, rather than letting the
        # overflow sit and re-trigger on the next call.
        last = now - cap
        elapsed = cap

    ticks = int(elapsed / interval)
    if ticks > 0:
        setattr(player, field, last + ticks * interval)
    return ticks


def apply_passive_tick(player):
    """
    Apply energy regen, health regen, property-based item production, and
    the idle credit trickle for whatever wall-clock time has passed. Called
    at the top of every authenticated player action so state stays correct
    even if the player was away (no client-side interval required).

    Each resource ticks on its own clock via _consume_ticks - see that
    function for why sharing one clock silently broke passive production.

    Returns a summary dict; most callers ignore it, GET /player surfaces
    the fields it wants to narrate to the player.
    """
    now = utcnow()
    changed = False

    # Idle credit trickle, expressed as one credit per interval so it uses
    # the same whole-ticks-with-carry mechanism as everything else. The old
    # int(hours * rate) form floored to zero on every sub-144s poll.
    trickle_ticks = _consume_ticks(
        player, "last_trickle_at", OFFLINE_TRICKLE_INTERVAL, now,
        cap=timedelta(hours=OFFLINE_TRICKLE_CAP_HOURS),
    )
    if trickle_ticks > 0:
        player.credits += trickle_ticks
        changed = True

    # Energy regen: +ENERGY_REGEN_AMOUNT per interval, capped at maxEnergy.
    # Ticks are consumed whether or not the player is already full, so
    # sitting at max doesn't bank time that would instantly refill later.
    energy_ticks = _consume_ticks(player, "last_energy_tick_at", ENERGY_REGEN_INTERVAL, now)
    if energy_ticks > 0 and player.energy < player.maxEnergy:
        player.energy = min(player.maxEnergy, player.energy + energy_ticks * ENERGY_REGEN_AMOUNT)
        changed = True

    # Health regen. Health used to have no passive recovery at all, which
    # made the only rank-1 mission negative-EV once healing was priced in
    # and hard-locked players out of every regular mission after a run of
    # failures (player_meets_requirements refuses a mission that could take
    # you to 0). Slow on purpose - Medlab items are still worth buying to
    # skip the wait, they're just no longer mandatory.
    health_ticks = _consume_ticks(player, "last_health_tick_at", HEALTH_REGEN_INTERVAL, now)
    health_gained = 0
    if health_ticks > 0 and player.health < player.maxHealth:
        before = player.health
        player.health = min(player.maxHealth, player.health + health_ticks * HEALTH_REGEN_AMOUNT)
        health_gained = player.health - before
        changed = True

    # Property production: each owned property generates its item at its
    # configured rate per PROPERTY_PRODUCTION_INTERVAL.
    production_ticks = _consume_ticks(
        player, "last_production_tick_at", PROPERTY_PRODUCTION_INTERVAL, now,
        cap=timedelta(hours=PRODUCTION_CAP_HOURS),
    )
    if production_ticks > 0 and player.properties:
        inventory = dict(player.inventory or {})
        for property_name, owned_qty in (player.properties or {}).items():
            if not owned_qty:
                continue
            _, property_data = find_property(property_name)
            if not property_data:
                continue
            generated_item = property_data["Item Generated"]
            rate = property_data["Generation Rate"]
            existing_entry = inventory.get(generated_item, {})
            current_qty = existing_entry.get("quantity", 0)
            current_avg_cost = existing_entry.get("avg_cost", 0)
            # Production is allowed to overfill past maxInventoryCount, up
            # to a generous multiple. Hard-stopping at the cap meant a
            # high-rate property filled its 10 slots in under a minute and
            # then idled for the rest of the hour - up to a 65x shortfall
            # against the payback period its cost was solved for. The
            # player still has to sell it down; they just stop losing the
            # output while they're away.
            ceiling = player.maxInventoryCount * PRODUCTION_OVERFLOW_MULTIPLE
            if current_qty >= ceiling:
                continue
            gained = owned_qty * rate * production_ticks
            new_qty = min(ceiling, current_qty + gained)
            # Round to avoid inventory accumulating values like 0.001 from
            # the fractional generation rates of high-value items.
            new_qty = round(new_qty, 2)
            if new_qty != current_qty:
                # Passively generated units are free (already paid for via
                # the property itself) - blend them into the average cost
                # at $0 rather than overwriting the whole entry, which
                # would silently wipe any avg_cost tracked from market
                # purchases of the same item.
                new_avg_cost = (
                    round((current_avg_cost * current_qty) / new_qty, 2)
                    if new_qty > 0
                    else 0
                )
                inventory[generated_item] = {
                    "quantity": new_qty,
                    "avg_cost": new_avg_cost,
                }
                changed = True
        if changed:
            player.inventory = inventory

    player.last_tick_at = now
    if changed:
        db.session.add(player)

    return {"offline_credits": trickle_ticks, "health_regenerated": health_gained}


def apply_login_streak(player):
    """
    Bump the daily login streak (and grant its credit bonus) the first time
    this runs on a new UTC calendar day. Called from GET /player, which the
    frontend hits both right after login and on its regular poll - so this
    covers "logged in again the next day" and "left a tab open across
    midnight" with one code path. Returns the bonus granted (0 if none).
    """
    now = utcnow()
    last = player.last_login_at

    if last is not None and last.date() == now.date():
        return 0

    if last is not None and (now.date() - last.date()).days == 1:
        player.login_streak += 1
    else:
        player.login_streak = 1

    player.last_login_at = now
    bonus = STREAK_BONUS_PER_DAY * min(player.login_streak, STREAK_BONUS_CAP_DAYS)
    player.credits += bonus
    db.session.add(player)
    return bonus


def apply_level_ups(player):
    """
    Grant every level the player's current experience qualifies for (fixes
    the old client logic, which only ever granted one level per call and
    discarded any XP above the threshold instead of carrying it forward).

    Levelling also raises the max health/energy floor. Without this,
    maxEnergy stayed flat at 100 while mission energy cost scaled with rank
    (8 + rank*1.6), so a level-50 player got ~1.7 actions per full bar
    against a level-1 player's ~15 - the game let you play *less* the more
    you invested in it.
    """
    leveled_up = False
    while True:
        xp_needed = player.level * XP_PER_LEVEL
        if player.experience < xp_needed:
            break
        player.experience -= xp_needed
        player.level += 1
        player.credits += player.level * LEVEL_UP_CREDIT_BONUS
        player.maxEnergy += MAX_ENERGY_PER_LEVEL
        player.maxHealth += MAX_HEALTH_PER_LEVEL
        leveled_up = True
    return leveled_up


def mission_xp_award(player, mission):
    """
    Experience actually granted, with a falloff for badly over-levelled
    content. Flat XP made grinding a mission far below your level strictly
    the fastest way to level, because low rank means a high success chance
    and failures refund far less energy than successes - so easy content
    won on both throughput axes at once. The falloff is the standard RPG
    answer: out-levelled missions stop being worth grinding.
    """
    over = max(0, player.level - mission["Rank"])
    multiplier = max(XP_FALLOFF_FLOOR, 1 - XP_FALLOFF_PER_LEVEL * over)
    return max(1, round(mission["Experience"] * multiplier))


def resolve_mission_equipment_loss(player, required_equipment):
    """
    On mission failure, consume 1 unit of each required equipment item
    (down to zero), instead of wiping the full required quantity. Extra
    units bought beyond what's required now act as a buffer: a player
    carrying spares loses one but stays above the requirement, while one
    holding exactly the minimum drops below it and has to restock.
    """
    if not required_equipment:
        return
    equipment = dict(player.equipment or {})
    for item_name in required_equipment:
        held = equipment.get(item_name)
        if held and held.get("quantity", 0) > 0:
            new_qty = held["quantity"] - 1
            equipment[item_name] = {**held, "quantity": new_qty}
    player.equipment = equipment


def player_meets_requirements(player, mission):
    if player.credits < mission["Required Credits"]:
        return False, "Not enough credits for this mission."
    if player.energy < mission["Required Energy"]:
        return False, "Not enough energy for this mission."
    equipment = player.equipment or {}
    for item_name, required_qty in (mission.get("requiredEquipment") or {}).items():
        held_qty = equipment.get(item_name, {}).get("quantity", 0)
        if held_qty < required_qty:
            return False, f"Requires {required_qty}x {item_name}."
    # A failed attempt costs health equal to the mission's "Health Effect".
    # Refusing to start a mission that could drop health to 0 makes death
    # unreachable, rather than letting it happen and then softening the
    # penalty afterward.
    if player.health - mission["Health Effect"] <= 0:
        return False, (
            "Your health is too low for this mission - a failed attempt "
            "could leave you at 0. Recover first."
        )
    return True, None


def mission_success_chance(player, mission):
    """
    The odds actually used to resolve a mission attempt. Exposed as its own
    function so the API can report it back to the player (e.g. in the
    mission result message) rather than the chance being an invisible
    server-side detail.
    """
    level_advantage = player.level - mission["Rank"]
    advantage_bonus = level_advantage * SUCCESS_PER_LEVEL_ADVANTAGE
    # Only the upside is capped: being under-levelled should still hurt
    # without limit (story missions aren't level-gated), but grinding
    # far-below-level content shouldn't approach a guaranteed win.
    advantage_bonus = min(advantage_bonus, MAX_LEVEL_ADVANTAGE_BONUS)
    chance = BASE_SUCCESS_CHANCE + advantage_bonus

    equipment = player.equipment or {}
    equipment_bonus = 0
    for item_name, required_qty in (mission.get("requiredEquipment") or {}).items():
        owned_qty = equipment.get(item_name, {}).get("quantity", 0)
        extra = max(0, owned_qty - required_qty)
        equipment_bonus += extra * SUCCESS_PER_EXTRA_EQUIPMENT
    chance += min(equipment_bonus, MAX_EQUIPMENT_BONUS)

    return max(MIN_SUCCESS_CHANCE, min(MAX_SUCCESS_CHANCE, chance))


def resolve_mission(player, mission):
    """
    Runs a mission attempt to completion synchronously (the original
    client-side setTimeout delay was purely cosmetic UI pacing, not a real
    async process) and returns (success, message).

    Reward handling fixes a bug in the original client logic: mission data
    defines a "Reward" value (e.g. 3000 credits for Asteroid Mining) that
    was never actually paid out - success only refunded the entry cost.
    Here, "Required Credits" is the entry cost and "Reward" is the payout
    on success, which is what the mission data and its own successMessage
    text always implied. A failure refunds MISSION_FAILURE_REFUND_PCT of
    the entry, so a losing streak bleeds rather than bankrupts.

    Health can only ever drop here, from a failure's "Health Effect", and
    player_meets_requirements already refuses to start a mission whose
    Health Effect could take the player to 0 - so a mission attempt can
    never end in death.
    """
    player.credits -= mission["Required Credits"]
    player.energy -= mission["Required Energy"]

    # A "Guaranteed" mission always succeeds. This exists so there is always
    # at least one action that cannot fail and costs no credits - otherwise
    # a player who loses their bankroll on a run of failures has no way back
    # into the game at all.
    success = mission.get("Guaranteed") or random.random() < mission_success_chance(player, mission)

    if success:
        xp_awarded = mission_xp_award(player, mission)
        player.credits += mission["Reward"]
        player.experience += xp_awarded
        player.energy = min(player.maxEnergy, player.energy + mission["Required Energy"] // 2)
        # successMessage is a template ("...gaining {reward} credits and
        # {experience} experience.") formatted from the mission's own live
        # values, so the flavor text can never drift out of sync with what
        # was actually awarded - including after any future rebalance, and
        # including the over-levelled XP falloff.
        message = mission["successMessage"].format(
            reward=mission["Reward"], experience=xp_awarded
        )
        if xp_awarded < mission["Experience"]:
            message = f"{message} (XP reduced - this mission is below your level.)"
    else:
        refund = int(mission["Required Credits"] * MISSION_FAILURE_REFUND_PCT)
        player.credits += refund
        player.health -= mission["Health Effect"]
        player.energy = min(player.maxEnergy, player.energy + mission["Required Energy"] // 8)
        resolve_mission_equipment_loss(player, mission.get("requiredEquipment"))
        message = mission["failureMessage"]
        if refund > 0:
            message = f"{message} ({refund} credits recovered.)"

    player.energy = max(0, player.energy)
    apply_level_ups(player)

    # Appended here (rather than client-side after the fact) since health
    # only ever drops from this one source - the server already knows the
    # real post-mutation value, so the stored/toasted message is complete
    # and correct without a separate client-side text transform.
    if player.maxHealth and player.health / player.maxHealth <= LOW_HEALTH_RATIO:
        message = f"{message} ⚠ Health critically low ({player.health}/{player.maxHealth})."

    return success, message
