"""
Server-side, authoritative game economy: market prices, passive regen/
production, mission resolution, and levelling. Every player action that
changes credits, stats, inventory, or experience is computed here instead
of trusting values sent by the client.
"""
import math
import random
import statistics
from datetime import datetime, timedelta
from functools import lru_cache

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
# Per-tick noise, drawn per item from this band (see item_volatility): a
# single global figure meant an Omega Seal moved exactly like an Alpha
# Core, so every item felt identical to trade. Now some are steady blue
# chips and some are speculative.
PRICE_VOLATILITY_MIN = 0.010
PRICE_VOLATILITY_MAX = 0.025

# Momentum. Each item carries a hidden drift that persists across ticks
# and occasionally re-rolls, which is what turns the chart from white
# noise into something worth reading: rallies and slumps that continue
# long enough to trade on. Pure noise has no autocorrelation, so no
# amount of chart-watching could ever pay off.
PRICE_TREND_FLIP_CHANCE = 0.01           # ~ once every 100 ticks (50 min)
PRICE_TREND_MAX = 0.02                   # must stay < PRICE_REVERSION_PULL

# The anchor the price reverts to is itself a slow random walk around the
# catalog's base cost, rather than base cost exactly. A fixed, published
# anchor makes "buy under base and wait" a ~98% win - free money on a
# timer. A moving one means a cheap price might be a bargain or might be
# the item genuinely being worth less now, which is the judgement call
# that makes trading a game instead of arithmetic. Kept slow and tightly
# bounded so the catalog price still means something.
FAIR_VALUE_DRIFT = 0.004
FAIR_VALUE_PULL = 0.004
FAIR_VALUE_MAX_DEVIATION = 0.30
# Prices are pulled gently back toward base every tick instead of being
# snapped to it once they drift too far. The old rule ("if more than 35%
# from base, reset to exactly base") was written as a safety rail to stop
# prices reaching zero or something absurd, but at +/-35% the rail sat
# close enough to shape play: it hard-bounded the price at 0.65x-1.35x,
# wiped 35% off a holding without warning, and - because the floor was
# only 1% below the snap point while the snap paid +54% - made "buy
# anything near 0.65x and wait" a farmable free-money trade rather than a
# market bet.
#
# This is the standard mean-reverting walk: each tick moves the price a
# small fraction of the way home, plus noise. No discontinuities, no hard
# band to trade against, and prices still cluster around base.
#
# The pull is also what BOUNDS the walk now that prices trend. A drift of
# `t` per tick balances the pull at price = base * pull / (pull - t), so
# keeping PRICE_TREND_MAX strictly below PRICE_REVERSION_PULL makes the
# equilibrium finite by construction - here 0.04 / (0.04 - 0.02) = 2x
# base. Prices can't run away, and that's a proof rather than a patch.
PRICE_REVERSION_PULL = 0.04
# Genuine safety rails, kept deliberately far out so they are dead-man's
# switches rather than gameplay. Over 7.6 simulated years of one item the
# price never left 0.62x-1.66x and these never fired once; they exist so
# a pathological run still can't reach zero or run away. Unlike the old
# rule these CLAMP (the price stops at the rail and gets pulled back
# gradually) rather than teleporting the price to base.
PRICE_FLOOR_MULTIPLE = 0.35
PRICE_CEILING_MULTIPLE = 3.0
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
# Overflow regen banks into a rested reserve at this rate, up to one full
# extra bar - see the energy block in apply_passive_tick.
RESTED_ENERGY_BANK_RATE = 0.5
RESTED_ENERGY_CAP_MULTIPLE = 1.0
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
PRODUCTION_OVERFLOW_MULTIPLE = 2
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
# collapse as mission energy costs scale up with rank. At +5/level the
# full-bar burst still SHRANK from 10 missions at level 1 to 4 at level
# 50 (costs grew faster) - the game handed out less to do per sitting the
# further you got. +10/level plus the flattened mission energy costs
# makes the burst grow to ~12-14 instead.
MAX_ENERGY_PER_LEVEL = 10
MAX_HEALTH_PER_LEVEL = 4

# A win on a mission this many levels below the player neither builds nor
# pays the win streak. At ~95% success and full spares, streak-boosted
# spam of far-out-levelled missions was measured (60h simulation) as the
# rational strategy under energy scarcity: one level-78 run chose the
# rank-14 mission 988 times. The reward falloff already floors the payout;
# this closes the streak bonus that made the treadmill pay anyway.
STREAK_OVERLEVEL_CUTOFF = 15
# Experience falls off for missions well below the player's level, so
# grinding out-levelled content stops being the optimal way to level.
XP_FALLOFF_PER_LEVEL = 0.12
XP_FALLOFF_FLOOR = 0.15
# Credits fall off for over-levelled content too. Previously only XP did,
# so out-levelling a mission made it strictly better as an earner: the
# success chance climbed toward the cap while the payout stayed flat, and
# the safe, familiar low-rank mission out-earned the risky one at your
# own level. There was no reason to ever move up. Gentler than the XP
# falloff (8%/level, floor 25%) because credits are the resource the
# player plans around, but steep enough to be decisive: farming a rank-6
# mission at level 14 pays ~2,700 against ~20,400 for the at-level one.
REWARD_FALLOFF_PER_LEVEL = 0.08
REWARD_FALLOFF_FLOOR = 0.25
# Beyond the streak cutoff (15+ levels over) the floor halves again. With
# flattened energy costs a max-level player can run the rank-50 mission
# ~100+ times an hour; at a 25% floor of a 634k reward that farmed out to
# ~15M/hour forever, which made prestige pointless. 10% keeps post-50
# farming worthwhile without it dwarfing everything else in the game.
REWARD_FALLOFF_DEEP_FLOOR = 0.10
# Levels above a mission's rank that are NOT counted as out-levelling it.
# Mission ranks step by 2-3 (1, 3, 6, 8, 10, 12, ...), so on every other
# level the newest mission a player can reach is already one rank below
# them: at level 13 the best available is rank 12. Without this grace the
# falloff penalised players for the catalog's own spacing - the correct,
# freshly unlocked mission paid a reduced reward - which is the opposite
# of what the falloff is for. Set to the largest gap between consecutive
# ranks so the newest mission always pays in full.
LEVEL_GRACE = 2

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

# Each rebirth also multiplies mission credits AND experience, permanently.
# Stat floors alone made prestige a bad trade: a max-level player farming
# the rank-50 mission at the deep falloff floor still cleared ~6M/hour,
# against which "your bars start 20 higher" was nothing. +12% earnings per
# prestige (to +60% at five) is the compounding reason to actually reset -
# and it stacks with the ship, which a rebirth keeps.
PRESTIGE_REWARD_BONUS_PER_LEVEL = 0.12
PRESTIGE_REWARD_BONUS_CAP = 0.60


def prestige_bonus(player):
    level = min(player.prestige_level or 0, 5)
    return min(PRESTIGE_REWARD_BONUS_CAP,
               level * PRESTIGE_REWARD_BONUS_PER_LEVEL)


# --- Allied warbands ------------------------------------------------------
# The tribes' own forces, funded/armed/provisioned by the player (never
# commanded - canon). The gate rule: gate on what's PERMANENT (strength,
# which never decays - access earned is never lost), modulate by what
# DECAYS (readiness, which sags to a floor when provisions run dry and
# springs back the moment they're restocked - the constant-player
# protection, same principle as rested energy).
WARBAND_MAX_STRENGTH = 100
# Volunteers get pricier as a company grows: cost = base * (1 + n/50).
WARBAND_COST_GROWTH = 50
# One gear kit outfits 10 volunteers; kits cost 5x the volunteer base.
WARBAND_KIT_SIZE = 10
WARBAND_KIT_COST_MULT = 5
# Provisions drain per hour per 10 strength (in provision-item units),
# capped at 72 hours of stock so provisioning is upkeep, not a vault.
WARBAND_PROVISION_DRAIN = 1.0
WARBAND_PROVISION_CAP_HOURS = 72
# Readiness: 40% floor (dry), up to 100% with full kits + provisions.
WARBAND_READINESS_FLOOR = 40
# Escorted missions: success bonus up to +5% at 100% readiness (halved
# for an out-of-region escort), and failure health loss reduced up to 20%.
ESCORT_SUCCESS_MAX = 0.05
ESCORT_HEALTH_REDUCTION_MAX = 0.20
# Regular ops start needing an escort above the solo ranks (canon: one
# man and a drone handles the early war personally).
ESCORT_SOLO_RANK = 8


def warband_state(player, faction):
    """A faction's warband record with defaults filled in (never None)."""
    state = (player.warbands or {}).get(faction) or {}
    return {
        "strength": state.get("strength", 0),
        "kits": state.get("kits", 0),
        "provisions": state.get("provisions", 0.0),
        "last_provision_tick_at": state.get("last_provision_tick_at"),
    }


def warband_unlocked(player, faction):
    cfg = game_data.WARBANDS.get(faction)
    return bool(cfg) and (player.storyWins or 0) >= cfg["unlock_wins"]


def warband_volunteer_cost(faction, current_strength):
    base = game_data.WARBANDS[faction]["volunteer_cost"]
    return max(1, round(base * (1 + current_strength / WARBAND_COST_GROWTH)))


def warband_kit_cost(faction):
    return game_data.WARBANDS[faction]["volunteer_cost"] * WARBAND_KIT_COST_MULT


def warband_provision_drain_per_hour(strength):
    return (strength / WARBAND_KIT_SIZE) * WARBAND_PROVISION_DRAIN


def warband_readiness(state):
    """
    40 (dry floor) .. 100 (full kits, provisioned). Computed live from
    the raw state - nothing stored, nothing to drift. Kits cover 10
    volunteers each; provisions are binary here (any stock = fed).
    """
    strength = state["strength"]
    if strength <= 0:
        return 0
    kits_needed = max(1, math.ceil(strength / WARBAND_KIT_SIZE))
    gear_coverage = min(1.0, state["kits"] / kits_needed)
    provisioned = state["provisions"] > 0
    if not provisioned:
        return WARBAND_READINESS_FLOOR
    return round(WARBAND_READINESS_FLOOR
                 + (100 - WARBAND_READINESS_FLOOR) * gear_coverage)


def escort_strength_required(mission):
    """Regular ops: escort size scales with rank; solo below rank 9."""
    rank = mission.get("Rank", 1)
    if mission.get("Guaranteed") or rank <= ESCORT_SOLO_RANK:
        return 0
    return min(60, math.ceil((rank - ESCORT_SOLO_RANK) / 8) * 10)


def pick_escort(player, mission):
    """
    (faction, state) of the escorting warband for a regular op. The
    region's own warband escorts when it can actually meet the strength
    gate (it fights at full effect at home); otherwise the strongest
    unlocked warband marches instead. None when nothing is unlocked.
    """
    region = mission.get("Region")
    need = escort_strength_required(mission)
    candidates = [
        (faction, warband_state(player, faction))
        for faction in game_data.WARBANDS
        if warband_unlocked(player, faction)
    ]
    if not candidates:
        return None
    home = next(
        ((faction, state) for faction, state in candidates
         if game_data.WARBANDS[faction]["region"] == region),
        None,
    )
    if home and home[1]["strength"] >= need:
        return home
    return max(candidates, key=lambda pair: pair[1]["strength"])


def escort_bonus(player, mission):
    """
    Success-chance bonus from the escorting warband on a regular op
    (0.0 when the op is solo-rank or no escort exists). Out-of-region
    escorts fight at half effect - a land's ops go best beside its own.
    """
    if escort_strength_required(mission) == 0:
        return 0.0
    escort = pick_escort(player, mission)
    if not escort:
        return 0.0
    faction, state = escort
    readiness = warband_readiness(state)
    if readiness <= 0:
        return 0.0
    home = game_data.WARBANDS[faction]["region"] == mission.get("Region")
    return ESCORT_SUCCESS_MAX * (readiness / 100) * (1.0 if home else 0.5)


def host_average_strength(player):
    """Mean strength across all six warbands - the united front's weight."""
    total = sum(warband_state(player, f)["strength"]
                for f in game_data.WARBANDS)
    return total / max(1, len(game_data.WARBANDS))


def apply_warband_ticks(player, now):
    """
    Lazy provision drain, wall-clock based like every other resource.
    Called from apply_passive_tick. Copy-reassign (JSON column).
    """
    warbands = dict(player.warbands or {})
    changed = False
    for faction, raw in warbands.items():
        state = dict(raw or {})
        strength = state.get("strength", 0)
        provisions = state.get("provisions", 0.0)
        last = state.get("last_provision_tick_at")
        if strength <= 0 or provisions <= 0:
            # Nothing to drain; keep the clock current so a restock
            # doesn't get billed for the dry spell.
            state["last_provision_tick_at"] = now.isoformat()
            warbands[faction] = state
            changed = True
            continue
        if last:
            try:
                hours = max(
                    0.0,
                    (now - datetime.fromisoformat(last)).total_seconds() / 3600,
                )
            except ValueError:
                hours = 0.0
        else:
            hours = 0.0
        drain = hours * warband_provision_drain_per_hour(strength)
        state["provisions"] = round(max(0.0, provisions - drain), 3)
        state["last_provision_tick_at"] = now.isoformat()
        warbands[faction] = state
        changed = True
    if changed:
        player.warbands = warbands

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

# Win streaks: each consecutive successful mission adds a small credit
# bonus to the next reward, capped so it plateaus. Guaranteed missions
# (the Salvage Run bailout) neither build nor benefit from streaks -
# otherwise spamming the risk-free bailout becomes a free streak pump.
# Any mission failure resets the streak to zero, which is the tension the
# mechanic exists to create: a long streak makes the next risky attempt
# feel like it has something riding on it.
WIN_STREAK_BONUS_PER_WIN = 0.03
WIN_STREAK_CAP = 10

# Critical outcomes layered on the base success roll. A crit doubles the
# credit reward but deliberately not the XP, so the levelling pace is
# unchanged. A narrow escape softens a failure: no equipment is consumed
# and only half the health is lost. Net effect is a small (~+8% credits)
# buff and gentler downswings - both sides of a mission roll now have a
# second, rarer outcome to hope for.
CRIT_CHANCE = 0.08
CRIT_REWARD_MULTIPLIER = 2
NARROW_ESCAPE_CHANCE = 0.25

# Bounties and traveling merchants reuse the GameEvent machinery (same
# lazy spawn-on-request pattern, same shared-world scope): a bounty's
# `category` holds a regular mission's name and its multiplier boosts that
# mission's credit reward; a merchant's `category` holds an equipment
# category and its multiplier is the fraction of Base Cost actually
# charged (0.45 = 55% off). At most one of each is live at a time, and
# each has its own spawn cooldown so they stay occasional and noticeable.
PRICE_EVENT_KINDS = ("price_spike", "price_crash")
BOUNTY_SPAWN_CHANCE = 0.13
BOUNTY_CHECK_COOLDOWN = timedelta(minutes=6)
BOUNTY_MULTIPLIER_MIN = 1.5
BOUNTY_MULTIPLIER_MAX = 2.5
BOUNTY_DURATION_MIN = timedelta(minutes=5)
BOUNTY_DURATION_MAX = timedelta(minutes=10)
MERCHANT_SPAWN_CHANCE = 0.10
MERCHANT_CHECK_COOLDOWN = timedelta(minutes=8)
MERCHANT_PRICE_FACTOR_MIN = 0.40  # 60% off
MERCHANT_PRICE_FACTOR_MAX = 0.60  # 40% off
MERCHANT_DURATION_MIN = timedelta(minutes=3)
MERCHANT_DURATION_MAX = timedelta(minutes=6)

# Equipment category perks: each unit held in these categories nudges one
# mission variable, capped per category so a full locker is a loadout
# decision rather than a stat explosion. Deliberately NOT touching success
# chance - the odds breakdown shown on the mission card stays truthful.
# per_unit/cap are fractions; "direction" is just for building UI text.
EQUIPMENT_PERKS = {
    "Research":   {"per_unit": 0.02, "cap": 0.10},  # +mission XP
    "Transports": {"per_unit": 0.02, "cap": 0.10},  # -mission energy cost
    "Armor":      {"per_unit": 0.05, "cap": 0.25},  # -failure health loss
    "Vehicles":   {"per_unit": 0.02, "cap": 0.10},  # +mission credit reward
}

# Faction reputation: +1 with a story mission's faction per story win
# (United Front finale missions grant +1 with all six tribes). Two tiers:
# allies give trade discounts (equipment + Medlab, per-player transaction
# prices - shared market prices are deliberately untouched) and a success
# bonus on that faction's own story missions.
REP_TIER_1 = 10
REP_TIER_2 = 25
REP_DISCOUNT_T1 = 0.05
REP_DISCOUNT_T2 = 0.10
REP_STORY_BONUS_T1 = 0.03
REP_STORY_BONUS_T2 = 0.05

# The boss fight ("Boss": True in the catalog) can never be out-prepared
# past this ceiling - it's the climax, not a formality.
BOSS_MAX_SUCCESS_CHANCE = 0.75

# E.C.H.O. color commentary, appended to mission results on notable
# moments. One line max per mission, and only sometimes - chatter that
# fires every single time stops being chatter.
ECHO_CHATTER_CHANCE = 0.5
ECHO_CHATTER = {
    "crit": [
        "E.c.h.o.: Recalibrating my projections - that outcome was two sigmas better than my best case.",
        "E.c.h.o.: I have recorded this run for training purposes. Mine, not yours.",
        "E.c.h.o.: Statistically, that should not have gone that well. I am choosing not to question it.",
    ],
    "escape": [
        "E.c.h.o.: My damage forecast was... pessimistic. Delighted to be wrong.",
        "E.c.h.o.: That was closer than my sensors are comfortable admitting.",
        "E.c.h.o.: Hull intact, gear intact, pride negotiable. I will take it.",
    ],
    "streak": [
        "E.c.h.o.: Five in a row. I am beginning to suspect you practice when I am in sleep mode.",
        "E.c.h.o.: This streak is skewing my baseline models. Keep going.",
        "E.c.h.o.: At this win rate, Vortex actuaries are filing complaints about you by name.",
    ],
    "bounty": [
        "E.c.h.o.: Bounty payout confirmed. I have already spent 3% of it on sensor upgrades. Apologies.",
        "E.c.h.o.: The bounty board just marked your contract complete. Someone out there is very unhappy.",
        "E.c.h.o.: Claimed. For the record, I flagged that bounty first.",
    ],
}

# Goals: lifetime stat counters, daily contracts, achievements.
# Only these keys are persisted into Player.stats; other delta keys passed
# to bump_stats (e.g. missions_won_at_level) still tick matching contracts
# but aren't stored - they're contextual, not lifetime counters.
TRACKED_STATS = ("missions_won", "missions_failed", "items_sold", "credits_earned")
DAILY_CONTRACT_COUNT = 3

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


def item_volatility(item_name):
    """
    How jumpy one item's price is, fixed per item and stable across
    restarts (derived from the name, so it needs no column and no seed
    data). Gives the market a spread of personalities - steady staples
    versus speculative goods - which is what makes choosing *what* to
    trade a decision rather than a coin flip.
    """
    # A hash of the name, folded into the volatility band. Python's hash()
    # is salted per process, so use a stable arithmetic digest instead.
    digest = 0
    for char in item_name:
        digest = (digest * 31 + ord(char)) % 100003
    spread = PRICE_VOLATILITY_MAX - PRICE_VOLATILITY_MIN
    return PRICE_VOLATILITY_MIN + (digest % 1000) / 999 * spread


def volatility_label(item_name):
    """Public-facing risk tag for an item - a market knows which stocks are wild."""
    volatility = item_volatility(item_name)
    span = PRICE_VOLATILITY_MAX - PRICE_VOLATILITY_MIN
    if volatility < PRICE_VOLATILITY_MIN + span / 3:
        return "steady"
    if volatility < PRICE_VOLATILITY_MIN + 2 * span / 3:
        return "active"
    return "volatile"


def _tick_price(price_row, now):
    elapsed = now - (price_row.updated_at or now)
    if elapsed < PRICE_TICK_INTERVAL:
        return False

    # The anchor drifts slowly around base cost, so the level the price is
    # pulled toward is never exactly knowable.
    fair_value = price_row.fair_value or price_row.base_cost
    fair_value += (
        FAIR_VALUE_PULL * (price_row.base_cost - fair_value)
        + fair_value * (random.random() * 2 - 1) * FAIR_VALUE_DRIFT
    )
    fair_value = min(
        max(fair_value, price_row.base_cost * (1 - FAIR_VALUE_MAX_DEVIATION)),
        price_row.base_cost * (1 + FAIR_VALUE_MAX_DEVIATION),
    )
    price_row.fair_value = fair_value

    # Momentum regime: re-roll the item's persistent drift occasionally.
    if random.random() < PRICE_TREND_FLIP_CHANCE:
        price_row.trend = random.uniform(-PRICE_TREND_MAX, PRICE_TREND_MAX)

    # Three forces per tick: the trend (persistent, readable), the pull
    # toward fair value (bounds everything), and noise (per-item scale).
    # See the constants above for why this replaced snap-to-base.
    volatility = item_volatility(price_row.item_name)
    noise = price_row.current_cost * (random.random() * 2 - 1) * volatility
    momentum = price_row.current_cost * (price_row.trend or 0)
    pull = PRICE_REVERSION_PULL * (fair_value - price_row.current_cost)
    new_cost = price_row.current_cost + momentum + pull + noise

    if price_row.base_cost > 0:
        new_cost = min(
            max(new_cost, price_row.base_cost * PRICE_FLOOR_MULTIPLE),
            price_row.base_cost * PRICE_CEILING_MULTIPLE,
        )

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


def _random_duration(minimum, maximum):
    return timedelta(seconds=random.uniform(
        minimum.total_seconds(), maximum.total_seconds()
    ))


def _kind_on_cooldown(kinds, now, cooldown):
    """True if any event of these kinds ended (or will end) within `cooldown`."""
    recent_cutoff = now - cooldown
    return db.session.query(
        GameEvent.query
        .filter(GameEvent.kind.in_(kinds), GameEvent.ends_at > recent_cutoff)
        .exists()
    ).scalar()


def _maybe_spawn_price_event(active, now):
    """
    Maybe roll a new category-wide price event into existence.

    Price events are scoped per item category: several can run at once on
    *different* categories (up to MAX_CONCURRENT_EVENTS), but never two on
    the same one. Previously a single global event was allowed, and
    get_active_event() returned only the newest row - so if a second event
    ever did exist (the admin panel can create them freely, and there's an
    unlocked read-then-write race here), the older one silently stopped
    applying to prices and vanished from the banner.
    """
    price_events = [e for e in active if e.kind in PRICE_EVENT_KINDS]
    if len(price_events) >= MAX_CONCURRENT_EVENTS:
        return None

    busy_categories = {event.category for event in price_events}
    candidates = [c for c in game_data.ITEMS.keys() if c not in busy_categories]

    # Cooldown is per-category too: a category that just finished an event
    # shouldn't immediately start another, but an untouched category
    # shouldn't be blocked by an unrelated one.
    recent_cutoff = now - EVENT_CHECK_COOLDOWN
    cooling = {
        row.category for row in
        GameEvent.query.filter(
            GameEvent.kind.in_(PRICE_EVENT_KINDS),
            GameEvent.ends_at > recent_cutoff,
        ).all()
    }
    candidates = [c for c in candidates if c not in cooling]
    if not candidates:
        return None

    if random.random() > EVENT_SPAWN_CHANCE:
        return None

    category = random.choice(candidates)
    kind = random.choice(["price_spike", "price_crash"])
    magnitude = random.uniform(EVENT_MAGNITUDE_MIN, EVENT_MAGNITUDE_MAX)
    # Symmetric in log space: a crash divides where a spike multiplies. A
    # plain (1 - magnitude) would go negative once magnitude exceeds 1.
    multiplier = (1 + magnitude) if kind == "price_spike" else 1 / (1 + magnitude)

    # These are the biggest price moves in the game, and they were the one
    # kind absent from the Recent Price Changes feed - only the market's
    # small random-walk moves were logged there. Typed price-up/price-down
    # so the feed's existing direction filters catch them.
    pct = round(abs(multiplier - 1) * 100)
    if kind == "price_spike":
        log_notification(
            f"⚡ Price spike: {category} +{pct}% while the event lasts!",
            "price-up",
        )
    else:
        log_notification(
            f"⚡ Price crash: {category} -{pct}% while the event lasts!",
            "price-down",
        )

    return GameEvent(
        kind=kind,
        category=category,
        multiplier=multiplier,
        starts_at=now,
        ends_at=now + _random_duration(EVENT_DURATION_MIN, EVENT_DURATION_MAX),
    )


def _maybe_spawn_bounty(active, now):
    """
    Maybe post a bounty: a temporary credit-reward multiplier on one
    specific regular mission. Shared-world like every other GameEvent -
    sometimes the bounty lands on a mission above your level, and that's
    fine: it's aspirational, someone else might claim it.
    """
    if any(e.kind == "bounty" for e in active):
        return None
    if _kind_on_cooldown(["bounty"], now, BOUNTY_CHECK_COOLDOWN):
        return None
    if random.random() > BOUNTY_SPAWN_CHANCE:
        return None

    # Guaranteed missions are excluded for the same reason they're excluded
    # from win streaks: a reward boost on a risk-free mission isn't a
    # gamble, it's a faucet.
    candidates = [
        name for name, mission in game_data.MISSIONS.items()
        if not mission.get("Guaranteed")
    ]
    if not candidates:
        return None

    multiplier = round(random.uniform(BOUNTY_MULTIPLIER_MIN, BOUNTY_MULTIPLIER_MAX), 2)
    mission_name = random.choice(candidates)
    log_notification(
        f"⭐ Bounty posted: {multiplier}x reward on {mission_name}!", "bounty"
    )
    return GameEvent(
        kind="bounty",
        category=mission_name,
        multiplier=multiplier,
        starts_at=now,
        ends_at=now + _random_duration(BOUNTY_DURATION_MIN, BOUNTY_DURATION_MAX),
    )


def _maybe_spawn_merchant(active, now):
    """
    Maybe roll a traveling merchant: a short, steep discount on one
    equipment category's Base Cost. The multiplier stored is the fraction
    of the price actually charged, applied in the equipment-buy endpoint -
    market item prices are untouched.
    """
    if any(e.kind == "merchant" for e in active):
        return None
    if _kind_on_cooldown(["merchant"], now, MERCHANT_CHECK_COOLDOWN):
        return None
    if random.random() > MERCHANT_SPAWN_CHANCE:
        return None

    # Story gear is one-off narrative equipment priced as a milestone -
    # discounting it cheapens the milestone, so the merchant skips it.
    candidates = [c for c in game_data.EQUIPMENT.keys() if c != "Story"]
    if not candidates:
        return None

    category = random.choice(candidates)
    factor = round(random.uniform(MERCHANT_PRICE_FACTOR_MIN, MERCHANT_PRICE_FACTOR_MAX), 2)
    log_notification(
        f"🛒 Traveling merchant: {category} gear {round((1 - factor) * 100)}% off!",
        "merchant",
    )
    return GameEvent(
        kind="merchant",
        category=category,
        multiplier=factor,
        starts_at=now,
        ends_at=now + _random_duration(MERCHANT_DURATION_MIN, MERCHANT_DURATION_MAX),
    )


def apply_event_ticks():
    """
    Maybe roll new events into existence: category-wide price events,
    mission bounties, and traveling merchants, each with its own spawn
    chance and cooldown. Same lazy, request-driven pattern as
    apply_price_ticks - called wherever prices are read, no scheduler.
    Returns the full list of currently active events.
    """
    now = utcnow()
    active = get_active_events()

    spawned = [
        event for event in (
            _maybe_spawn_price_event(active, now),
            _maybe_spawn_bounty(active, now),
            _maybe_spawn_merchant(active, now),
        ) if event is not None
    ]
    if spawned:
        db.session.add_all(spawned)
        db.session.commit()
    return active + spawned


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
        # Only price events touch market prices. Bounty/merchant events
        # store a mission name / equipment category in `category`, which
        # can never collide with an item category today - but filtering on
        # kind keeps that a non-assumption.
        if event.kind in PRICE_EVENT_KINDS and event.category == category:
            multiplier *= event.multiplier
    return multiplier


def get_bounty_multiplier(mission_name, events=None):
    """Combined active-bounty reward multiplier for one regular mission (1.0 = none)."""
    if events is None:
        events = get_active_events()
    multiplier = 1.0
    for event in events:
        if event.kind == "bounty" and event.category == mission_name:
            multiplier *= event.multiplier
    return multiplier


def get_merchant_price_factor(category, events=None):
    """
    Fraction of Base Cost actually charged for an equipment category while
    a traveling merchant targets it (1.0 = no merchant, no discount).
    """
    if events is None:
        events = get_active_events()
    factor = 1.0
    for event in events:
        if event.kind == "merchant" and event.category == category:
            factor *= event.multiplier
    return factor


def get_effective_price(price_row, events=None):
    """
    The mid price right now: the stored current_cost adjusted by any active
    category-wide events. Computed at read time rather than persisted into
    current_cost itself, so an event needs no cleanup when it expires - the
    multiplier just stops applying.
    """
    return price_row.current_cost * get_event_multiplier(price_row.category, events)


def get_buy_price(price_row, events=None):
    """
    What the player pays per unit - mid plus half the spread. The spread is
    a property of the market, not of the player: everyone trades on the
    same quotes, and nothing a player owns moves them.
    """
    return get_effective_price(price_row, events) * (1 + MARKET_SPREAD_PCT / 2)


def get_sell_price(price_row, events=None):
    """What the player receives per unit - mid minus half the spread."""
    return get_effective_price(price_row, events) * (1 - MARKET_SPREAD_PCT / 2)


@lru_cache(maxsize=None)
def _mission_xp_per_credit(level):
    """
    The median XP a mission at this player's rank pays per credit it
    rewards. Median, not any single mission: rewards inside one rank vary
    more than tenfold (rank 1 spans 260 to 3,200), so picking one mission
    would set the rate by an accident of tie-breaking.
    """
    rank = max((m["Rank"] for m in game_data.MISSIONS.values()
                if not m.get("Guaranteed") and m["Rank"] <= level), default=None)
    if rank is None:
        return 0.0
    ratios = [m["Experience"] / m["Reward"]
              for m in game_data.MISSIONS.values()
              if m["Rank"] == rank and m["Reward"] > 0]
    return statistics.median(ratios) if ratios else 0.0


def trade_xp_award(player, profit):
    """
    Experience for a profitable sale.

    Trading previously granted none at all, so a trade-focused player was
    stuck at level 1 forever - locked out of the higher-rank goods that
    are the only ones worth trading, and therefore out of ever trading
    profitably. A closed trap.

    The rate is calibrated against missions rather than fixed: a credit of
    trading profit is worth the same XP as a credit of mission reward at
    your rank. No single credits-per-XP constant can work, because an
    at-level payday runs from a few hundred credits at level 1 to nearly a
    million at level 48 - any constant either hands out free levels at the
    top or none at all at the bottom.
    """
    if profit <= 0:
        return 0
    return int(profit * _mission_xp_per_credit(player.level))


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
        # How far the price sits from its anchor, and how jumpy this item
        # is. The raw base number on its own told the player very little;
        # the *distance* from it is the actual trading signal, and the
        # volatility tag says how much weight to put on a given swing.
        serialized["pct_from_base"] = (
            round((serialized["current_cost"] - row.base_cost) / row.base_cost * 100, 1)
            if row.base_cost else 0.0
        )
        serialized["volatility"] = volatility_label(row.item_name)
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


# Each Medlab use today multiplies the next one's price in that category.
# At flat prices with seconds-scale cooldowns, energy was purchasable at
# ~28 credits/point against missions paying 300-12,000 per point - a
# 12-hour simulation of a stim-chugging player earned 23.3M/hour against
# 86k for one who never opened the tab. A cooldown long enough to close
# that hole would have punished the most engaged players with a timer;
# rising prices let them keep pushing as hard as they will pay, with the
# curve crossing mission profit after roughly 7-14 uses a day - so a
# constant player buys real extra hours daily and the printer stays off.
RECOVERY_PRICE_MULTIPLIER = 1.5


def recovery_uses_today(player):
    """Per-category Medlab use counts, rolling over on the UTC date."""
    uses = dict(player.recovery_uses or {})
    today = utcnow().strftime("%Y-%m-%d")
    if uses.get("date") != today:
        return {"date": today}
    return uses


def recovery_price(player, category, item_data):
    """Today's escalated price for this item, before any rep discount."""
    uses = recovery_uses_today(player).get(category, 0)
    return round(item_data["Cost"] * RECOVERY_PRICE_MULTIPLIER ** uses)


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


def ship_bonus(player, module_id):
    """Total effect of an installed module: level x its per-level effect."""
    level = (player.ship or {}).get(module_id, 0)
    if not level:
        return 0
    return level * game_data.SHIP_MODULES[module_id]["effect_per_level"]


def ship_module_cost(player, module_id):
    """Cost of the NEXT level, or None once the module is maxed."""
    module = game_data.SHIP_MODULES[module_id]
    level = (player.ship or {}).get(module_id, 0)
    if level >= game_data.SHIP_MODULE_MAX_LEVEL:
        return None
    return int(module["base_cost"] * module["cost_multiplier"] ** level)


def energy_regen_amount(player):
    """
    Energy restored per regen tick. This is THE throughput lever: it was a
    hard-coded 1 for the whole game, so a player's actions-per-hour could
    never improve no matter how rich they got - and mission energy costs
    rise with rank, meaning the game got steadily slower. The reactor
    module lets credits buy speed.
    """
    return ENERGY_REGEN_AMOUNT + ship_bonus(player, "reactor")


def health_regen_amount(player):
    return HEALTH_REGEN_AMOUNT + ship_bonus(player, "medbay")


def production_pool_multiple(player):
    return PRODUCTION_OVERFLOW_MULTIPLE + ship_bonus(player, "cargo_drones")


def migrate_pending_to_properties(player):
    """
    Return the uncollected pool keyed by PROPERTY name, converting any
    entries left over from when it was keyed by item.

    Property pools used to be pooled per item, so two properties making
    the same good shared one store and neither could be claimed on its
    own. Rather than discard whatever a player had banked at upgrade
    time, each legacy entry is handed to an owned property that makes
    that item (splitting it if several do). Entries with no owning
    property are dropped - there is nothing left to collect them from.
    """
    pending = dict(player.pending_production or {})
    properties = player.properties or {}
    legacy = [key for key in pending if key not in properties]
    if not legacy:
        return pending

    for item_name in legacy:
        quantity = pending.pop(item_name)
        owners = [
            name for name in properties
            if (find_property(name)[1] or {}).get("Item Generated") == item_name
        ]
        if not owners:
            continue
        share = quantity / len(owners)
        for name in owners:
            pending[name] = pending.get(name, 0) + share
    return pending


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

    # Warband provisions drain on their own wall clock (lazy, like
    # everything else here). Strength and kits never decay.
    apply_warband_ticks(player, now)

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
    if energy_ticks > 0:
        # Regen that would spill past the cap banks into a rested reserve
        # at half rate instead of evaporating. Session players lost 90-100%
        # of their overnight regen to a bar that filled within the first
        # hour away; now coming back means a full bar plus a reserve that
        # refills it as it is spent - a real session, not three minutes.
        regen = energy_ticks * energy_regen_amount(player)
        space = max(0, player.maxEnergy - player.energy)
        used = min(regen, space)
        player.energy += used
        overflow = regen - used
        if overflow > 0:
            cap = player.maxEnergy * RESTED_ENERGY_CAP_MULTIPLE
            player.rested_energy = min(
                cap, (player.rested_energy or 0) + overflow * RESTED_ENERGY_BANK_RATE
            )
        changed = True
    if (player.rested_energy or 0) >= 1 and player.energy < player.maxEnergy:
        take = min(int(player.rested_energy), player.maxEnergy - player.energy)
        player.energy += take
        player.rested_energy = (player.rested_energy or 0) - take
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
        player.health = min(
            player.maxHealth,
            player.health + health_ticks * health_regen_amount(player),
        )
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
        remainders = dict(player.production_remainders or {})
        pending = migrate_pending_to_properties(player)
        # Legacy cleanup: inventories written before whole-item production
        # can hold fractional quantities. Fold the fraction back into the
        # carry pool so the visible inventory is always whole units.
        for item_name, entry in list(inventory.items()):
            qty = entry.get("quantity", 0)
            whole = math.floor(qty)
            if qty != whole:
                remainders[item_name] = round(remainders.get(item_name, 0) + (qty - whole), 6)
                if whole > 0:
                    inventory[item_name] = {**entry, "quantity": whole}
                else:
                    inventory.pop(item_name, None)
                changed = True

        for property_name, owned_qty in (player.properties or {}).items():
            if not owned_qty:
                continue
            _, property_data = find_property(property_name)
            if not property_data:
                continue
            rate = property_data["Generation Rate"]
            # Output accrues to a pool PER PROPERTY, not straight to
            # inventory and not pooled per item. Writing to inventory made
            # maxInventoryCount meaningless; pooling per item meant two
            # properties making the same good shared one store, so neither
            # could be claimed or reported on individually.
            current_qty = pending.get(property_name, 0)
            ceiling = player.maxInventoryCount * production_pool_multiple(player)
            if current_qty >= ceiling:
                continue

            # Only WHOLE items are ever deposited. Sub-unit output carries
            # forward in production_remainders until it completes a unit -
            # the same carry-the-remainder rule the tick clocks use. A
            # low-rate property (0.0213/tick) therefore delivers 1 item
            # every ~47 ticks instead of dribbling unsellable slivers into
            # the inventory that floor to "Owned: 0" but still get valued.
            produced = owned_qty * rate * production_ticks + remainders.get(property_name, 0)
            gained = math.floor(produced)
            carry = round(produced - gained, 6)
            if gained <= 0:
                if carry != remainders.get(property_name, 0):
                    remainders[property_name] = carry
                    changed = True
                continue

            # Output above the ceiling is lost, not banked - otherwise a
            # full pool would keep filling the carry pool forever.
            remainders[property_name] = carry
            pending[property_name] = min(ceiling, current_qty + gained)
            changed = True

        if changed:
            player.inventory = inventory
            player.production_remainders = remainders
            player.pending_production = pending

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


def _achievement_metric_value(player, metric):
    if metric.startswith("stat:"):
        return (player.stats or {}).get(metric[len("stat:"):], 0)
    if metric == "level":
        return player.level
    if metric == "prestige":
        return player.prestige_level or 0
    if metric == "storyWins":
        return player.storyWins or 0
    if metric == "credits":
        return player.credits
    if metric == "properties_owned":
        return len(player.properties or {})
    return 0


def check_achievements(player):
    """
    Earn any achievement whose threshold the player now meets. Cheap: only
    unearned entries are evaluated, against values already on the player
    row. Returns the ActivityLogEntry rows created so endpoints can
    surface them as toasts.
    """
    earned = list(player.achievements or [])
    earned_set = set(earned)
    entries = []
    for ach in game_data.ACHIEVEMENTS:
        if ach["id"] in earned_set:
            continue
        if _achievement_metric_value(player, ach["metric"]) >= ach["threshold"]:
            earned.append(ach["id"])
            title_note = f" Title earned: {ach['title']}." if ach.get("title") else ""
            entries.append(log_activity(
                player,
                f"🏆 Achievement unlocked: {ach['name']} - {ach['desc']}.{title_note}",
                "achievement",
            ))
    if entries:
        player.achievements = earned
        db.session.add(player)
    return entries


def _tick_contracts(player, deltas):
    """
    Advance today's contracts by whatever just happened (contract kinds
    are bump_stats delta keys). A completed contract auto-grants its
    reward immediately - no claim button between the player and the payoff.
    """
    data = player.daily_contracts or {}
    contracts = data.get("contracts") or []
    if not contracts:
        return []
    entries = []
    changed = False
    updated = []
    for contract in contracts:
        c = dict(contract)
        delta = deltas.get(c.get("kind"), 0)
        if not c.get("done") and delta:
            c["progress"] = min(c["goal"], c.get("progress", 0) + delta)
            changed = True
            if c["progress"] >= c["goal"]:
                c["done"] = True
                player.credits += c["reward"]
                entries.append(log_activity(
                    player,
                    f"📋 Contract complete: {c['desc']}. +{c['reward']} credits!",
                    "contract",
                ))
        updated.append(c)
    if changed:
        player.daily_contracts = {**data, "contracts": updated}
    return entries


def bump_stats(player, best_win_streak=None, **deltas):
    """
    The single funnel for "something countable happened": persists lifetime
    counters (TRACKED_STATS only), ticks matching daily contracts, then
    runs the achievement check. best_win_streak is a high-water mark, not
    a delta. Returns every ActivityLogEntry created (contract completions,
    achievements) so the calling endpoint can include them in its response
    for immediate toasting instead of waiting for the next activity poll.
    """
    stats = dict(player.stats or {})
    for key, delta in deltas.items():
        if key in TRACKED_STATS and delta:
            stats[key] = stats.get(key, 0) + delta
    if best_win_streak is not None:
        stats["best_win_streak"] = max(stats.get("best_win_streak", 0), best_win_streak)
    player.stats = stats

    entries = _tick_contracts(player, deltas)
    entries.extend(check_achievements(player))
    db.session.add(player)
    return entries


def _reference_mission_reward(level):
    """
    The biggest non-Guaranteed mission reward available at this level -
    the yardstick contract goals and rewards scale against, so a day's
    contracts stay worth roughly 2-3 at-level missions at any level.
    """
    rewards = [
        m["Reward"] for m in game_data.MISSIONS.values()
        if not m.get("Guaranteed") and m["Rank"] <= level
    ]
    return max(rewards) if rewards else 500


def ensure_daily_contracts(player):
    """
    (Re)generate the player's three daily contracts the first time they're
    seen on a new UTC calendar day. Called from GET /player beside
    apply_login_streak - same lazy pattern, no scheduler. Seeded by
    (player id, date) so a refresh can never reroll the day's contracts.
    Returns the "new contracts" ActivityLogEntry, or None if today's
    contracts already exist.
    """
    today = utcnow().date().isoformat()
    data = player.daily_contracts or {}
    if data.get("date") == today:
        return None

    rng = random.Random(f"{player.id}:{today}")
    base = _reference_mission_reward(player.level)

    def credits_of(fraction, floor=50):
        return max(floor, int(round(base * fraction / 10.0)) * 10)

    win_goal = rng.randint(3, 6)
    sell_goal = rng.randint(5, 12)
    earn_goal = credits_of(1.5, floor=200)
    pool = [
        {"id": "win-missions", "kind": "missions_won",
         "desc": f"Win {win_goal} missions", "goal": win_goal,
         "reward": credits_of(0.9)},
        {"id": "sell-items", "kind": "items_sold",
         "desc": f"Sell {sell_goal} items on the market", "goal": sell_goal,
         "reward": credits_of(0.6)},
        {"id": "earn-credits", "kind": "credits_earned",
         "desc": f"Earn {earn_goal} credits", "goal": earn_goal,
         "reward": credits_of(0.8)},
        {"id": "win-at-level", "kind": "missions_won_at_level",
         "desc": "Win a mission at or above your level", "goal": 1,
         "reward": credits_of(1.0)},
        {"id": "use-recovery", "kind": "recovery_items_used",
         "desc": "Use a Medlab recovery item", "goal": 1,
         "reward": credits_of(0.4)},
    ]
    contracts = rng.sample(pool, DAILY_CONTRACT_COUNT)
    for contract in contracts:
        contract["progress"] = 0
        contract["done"] = False

    player.daily_contracts = {"date": today, "contracts": contracts}
    db.session.add(player)
    return log_activity(
        player, "📋 New daily contracts are in - check the Goals tab.", "contract"
    )


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


def mission_reward_award(player, mission, is_story=False):
    """
    Credits actually paid for a win, after the over-levelled falloff.

    Exempt: story missions (they must be run in sequence, so there is no
    "farm the easy one" to discourage - only a player punished for being
    over-levelled) and Guaranteed missions (the Salvage Run bailout is a
    safety net; scaling it down would defeat the point of it existing).
    """
    reward = mission["Reward"]
    if mission.get("Guaranteed"):
        return reward
    if is_story:
        return max(1, round(reward * (1 + prestige_bonus(player))))
    over = max(0, player.level - mission["Rank"] - LEVEL_GRACE)
    floor = (REWARD_FALLOFF_DEEP_FLOOR
             if player.level - mission["Rank"] >= STREAK_OVERLEVEL_CUTOFF
             else REWARD_FALLOFF_FLOOR)
    multiplier = max(floor, 1 - REWARD_FALLOFF_PER_LEVEL * over)
    multiplier *= 1 + prestige_bonus(player)
    return max(1, round(reward * multiplier))


def mission_xp_award(player, mission, perks=None):
    """
    Experience actually granted, with a falloff for badly over-levelled
    content. Flat XP made grinding a mission far below your level strictly
    the fastest way to level, because low rank means a high success chance
    and failures refund far less energy than successes - so easy content
    won on both throughput axes at once. The falloff is the standard RPG
    answer: out-levelled missions stop being worth grinding.

    The Research equipment perk boosts the final figure (capped, see
    EQUIPMENT_PERKS).
    """
    # Same grace as the credit falloff: the newest mission a player can
    # reach is often already a rank or two below them purely because of
    # how the catalog is spaced, and shouldn't be treated as out-levelled.
    over = max(0, player.level - mission["Rank"] - LEVEL_GRACE)
    multiplier = max(XP_FALLOFF_FLOOR, 1 - XP_FALLOFF_PER_LEVEL * over)
    if perks:
        multiplier *= 1 + perks.get("Research", 0)
    multiplier *= 1 + prestige_bonus(player)
    return max(1, round(mission["Experience"] * multiplier))


def _rep_tier_value(points):
    if points >= REP_TIER_2:
        return 2
    if points >= REP_TIER_1:
        return 1
    return 0


def rep_discount(player):
    """
    Trade discount fraction from the player's best faction relationship -
    allies anywhere get you better prices everywhere you shop.
    """
    rep = player.reputation or {}
    best = max((_rep_tier_value(v) for v in rep.values()), default=0)
    return {0: 0.0, 1: REP_DISCOUNT_T1, 2: REP_DISCOUNT_T2}[best]


def story_faction_bonus(player, mission):
    """
    Success bonus on a faction's own story missions once the player's
    standing with that faction reaches a tier. United Front missions use
    the WEAKEST of the six bonds - the finale is only as strong as the
    least-earned alliance.
    """
    faction = mission.get("Faction")
    if not faction:
        return 0.0
    rep = player.reputation or {}
    if faction == "United Front":
        points = min((rep.get(f, 0) for f in game_data.FACTIONS), default=0)
    else:
        points = rep.get(faction, 0)
    tier = _rep_tier_value(points)
    return {0: 0.0, 1: REP_STORY_BONUS_T1, 2: REP_STORY_BONUS_T2}[tier]


def grant_story_reputation(player, mission):
    """
    +1 rep with the mission's faction for a story win (all six for United
    Front missions). Returns the ActivityLogEntry rows for any tier
    crossings so they toast - silent +1s just show in the rep panel.
    """
    faction = mission.get("Faction")
    if not faction:
        return []
    factions = game_data.FACTIONS if faction == "United Front" else [faction]
    rep = dict(player.reputation or {})
    entries = []
    for name in factions:
        before = rep.get(name, 0)
        rep[name] = before + 1
        if _rep_tier_value(rep[name]) > _rep_tier_value(before):
            tier = _rep_tier_value(rep[name])
            perks_text = (
                f"{round(REP_DISCOUNT_T1 * 100)}% trade discount and better odds on their missions"
                if tier == 1 else
                f"{round(REP_DISCOUNT_T2 * 100)}% trade discount and even better odds on their missions"
            )
            entries.append(log_activity(
                player,
                f"🤝 The {name} now consider you a "
                f"{'trusted ally' if tier == 2 else 'friend'} - {perks_text}.",
                "rep",
            ))
    player.reputation = rep
    db.session.add(player)
    return entries


def equipment_perks(player):
    """
    Fraction bonuses per perk category, computed from units held (capped).
    E.g. {"Research": 0.06, "Transports": 0.0, ...}.
    """
    held = player.equipment or {}
    perks = {}
    for category, cfg in EQUIPMENT_PERKS.items():
        items = game_data.EQUIPMENT.get(category, {})
        units = sum(held.get(name, {}).get("quantity", 0) for name in items)
        perks[category] = min(cfg["cap"], units * cfg["per_unit"])
    return perks


def mission_energy_cost(player, mission, perks=None):
    """Effective energy cost after the Transports perk discount."""
    cost = mission["Required Energy"]
    if cost <= 0:
        return 0
    if perks is None:
        perks = equipment_perks(player)
    return max(1, round(cost * (1 - perks["Transports"])))


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
    # A bailout mission is only offered while the player is actually short
    # on funds. Without this, a zero-cost guaranteed-payout mission is an
    # unlimited risk-free income source that dominates everything else -
    # it exists to stop a broke player being stuck, not to be farmed.
    ceiling = mission.get("AvailableBelowCredits")
    if ceiling is not None and player.credits >= ceiling:
        return False, (
            f"Only available when you're below {ceiling} credits - "
            "you've got enough to take on real work."
        )
    # A region's ops are locked until the story reaches that land - the
    # war has a geography, and the player can't be running caravans in a
    # country Jahntow hasn't set foot in yet. Story missions carry no
    # Region field and are unaffected.
    region = mission.get("Region")
    if region is not None:
        needed = game_data.REGIONS.get(region, 0)
        if (player.storyWins or 0) < needed:
            return False, (
                f"{region} is still behind Vortex lines - the story "
                "hasn't taken you there yet. Advance the story missions "
                "to open this region."
            )

    # Collect EVERY blocking problem rather than returning at the first
    # one: a player missing several items was told about exactly one,
    # bought it, and got refused again for the next - one round-trip of
    # confusion per item.
    problems = []

    # Warband strength gates - permanent capability, so a passed gate can
    # never un-pass (readiness only modulates, it never blocks).
    if region is not None:
        need = escort_strength_required(mission)
        if need > 0:
            escort = pick_escort(player, mission)
            strength = escort[1]["strength"] if escort else 0
            if strength < need:
                problems.append(
                    f"This operation needs a warband escort of {need} "
                    f"(your best: {strength}). Fund your allies on the "
                    "Warbands tab."
                )
    else:
        # Story battles: act finales want that land's own warband; the
        # fortress endgame wants the whole host. Keyed by name, matched
        # by object identity (the catalog dicts are shared).
        gate = next(
            (game_data.STORY_WARBAND_GATES[name]
             for name, m in game_data.STORY_MISSIONS.items()
             if m is mission and name in game_data.STORY_WARBAND_GATES),
            None,
        )
        if gate and "faction" in gate:
            state = warband_state(player, gate["faction"])
            if state["strength"] < gate["strength"]:
                band = game_data.WARBANDS[gate["faction"]]["name"]
                problems.append(
                    f"The {band} must number {gate['strength']} for this "
                    f"battle (now: {state['strength']}). Fund them on the "
                    "Warbands tab."
                )
        elif gate:
            average = host_average_strength(player)
            if average < gate["host"]:
                problems.append(
                    "The united front is not ready - the host must "
                    f"average {gate['host']} strength across all six "
                    f"warbands (now: {average:.0f})."
                )

    if player.credits < mission["Required Credits"]:
        problems.append("Not enough credits for this mission.")
    if player.energy < mission_energy_cost(player, mission):
        problems.append("Not enough energy for this mission.")
    missing = []
    equipment = player.equipment or {}
    for item_name, required_qty in (mission.get("requiredEquipment") or {}).items():
        held_qty = equipment.get(item_name, {}).get("quantity", 0)
        if held_qty < required_qty:
            missing.append(f"{required_qty - held_qty}x {item_name}")
    # Supplies are market items consumed on every attempt (the fuel for the
    # run), unlike equipment which is only lost on failure.
    inventory = player.inventory or {}
    for item_name, required_qty in (mission.get("requiredSupplies") or {}).items():
        held_qty = inventory.get(item_name, {}).get("quantity", 0)
        if held_qty < required_qty:
            missing.append(f"{required_qty - held_qty}x {item_name} (supplies)")
    if missing:
        problems.append(f"Missing: {', '.join(missing)}.")
    # A failed attempt costs health equal to the mission's "Health Effect".
    # Refusing to start a mission that could drop health to 0 makes death
    # unreachable, rather than letting it happen and then softening the
    # penalty afterward.
    if player.health - mission["Health Effect"] <= 0:
        problems.append(
            "Your health is too low for this mission - a failed attempt "
            "could leave you at 0. Recover first."
        )
    if problems:
        return False, " ".join(problems)
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

    # Faction standing helps on that faction's own story missions.
    chance += story_faction_bonus(player, mission)

    # A ready warband escort helps on regular ops (scaled by readiness,
    # halved out of region). Applied before the ceiling clamps.
    chance += escort_bonus(player, mission)

    ceiling = MAX_SUCCESS_CHANCE
    # The boss fight keeps an irreducible one-in-four risk no matter how
    # over-prepared the player is.
    if mission.get("Boss"):
        ceiling = min(ceiling, BOSS_MAX_SUCCESS_CHANCE)

    return max(MIN_SUCCESS_CHANCE, min(ceiling, chance))


def resolve_mission(player, mission, mission_name=None, is_story=False):
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

    On top of the base roll: win streaks, critical successes, narrow
    escapes, and bounty multipliers (see the WIN_STREAK/CRIT/NARROW/BOUNTY
    constants). Guaranteed missions are excluded from all of them - the
    bailout stays a flat, boring floor on purpose.

    `mission_name` is the catalog key (bounties are stored against it);
    None just means no bounty can match.

    Health can only ever drop here, from a failure's "Health Effect", and
    player_meets_requirements already refuses to start a mission whose
    Health Effect could take the player to 0 - so a mission attempt can
    never end in death.

    Returns (success, message, goal_entries) where goal_entries are any
    contract/achievement ActivityLogEntry rows created by bump_stats.
    """
    perks = equipment_perks(player)

    player.credits -= mission["Required Credits"]
    player.energy -= mission_energy_cost(player, mission, perks)

    # Supplies burn on every attempt, win or lose - they're the fuel, not
    # a stake. This is the market->mission link (and credit sink) the
    # economy was missing: gearing up for a big run now means shopping.
    supplies = mission.get("requiredSupplies") or {}
    supplies_note = ""
    if supplies:
        inventory = dict(player.inventory or {})
        used = []
        for item_name, qty in supplies.items():
            entry = inventory.get(item_name, {})
            remaining = round(entry.get("quantity", 0) - qty, 2)
            if remaining > 0:
                inventory[item_name] = {**entry, "quantity": remaining}
            else:
                inventory.pop(item_name, None)
            used.append(f"{qty}x {item_name}")
        player.inventory = inventory
        supplies_note = f" (Supplies used: {', '.join(used)}.)"

    # A "Guaranteed" mission always succeeds. This exists so there is always
    # at least one action that cannot fail and costs no credits - otherwise
    # a player who loses their bankroll on a run of failures has no way back
    # into the game at all.
    guaranteed = bool(mission.get("Guaranteed"))
    success = guaranteed or random.random() < mission_success_chance(player, mission)
    # E.c.h.o. comments on at most one notable moment per mission, and
    # only sometimes (ECHO_CHATTER_CHANCE) - priority crit > bounty >
    # streak milestone > narrow escape.
    chatter_trigger = None

    if success:
        xp_awarded = mission_xp_award(player, mission, perks)
        reward = mission_reward_award(player, mission, is_story)
        reward_reduced = reward < mission["Reward"]
        # Vehicles perk: a flat, non-random boost from investment - applied to
        # the base before the luck-based multipliers stack on top.
        if perks["Vehicles"] > 0:
            reward = round(reward * (1 + perks["Vehicles"]))
        extras = []

        # A far-out-levelled win is treated like a Guaranteed one for
        # streak purposes: it neither builds nor collects the bonus, so
        # spamming trivial content can't keep a streak fed.
        streak_eligible = (
            not guaranteed
            and player.level - mission["Rank"] < STREAK_OVERLEVEL_CUTOFF
        )
        if not guaranteed:
            # Crit doubles credits only - XP is untouched so the levelling
            # pace doesn't compound with reward luck.
            if random.random() < CRIT_CHANCE:
                reward *= CRIT_REWARD_MULTIPLIER
                extras.append("💥 Critical success - double credits!")
                chatter_trigger = "crit"

            bounty_multiplier = get_bounty_multiplier(mission_name) if mission_name else 1.0
            if bounty_multiplier > 1:
                reward = round(reward * bounty_multiplier)
                extras.append(f"⭐ Bounty claimed: {bounty_multiplier:g}x reward.")
                chatter_trigger = chatter_trigger or "bounty"

            if streak_eligible:
                player.win_streak = (player.win_streak or 0) + 1
                streak_bonus = min(player.win_streak, WIN_STREAK_CAP) * WIN_STREAK_BONUS_PER_WIN
                reward = round(reward * (1 + streak_bonus))
                if player.win_streak >= 2:
                    extras.append(
                        f"🎯 Win streak {player.win_streak}: +{round(streak_bonus * 100)}% credits."
                    )
                if player.win_streak in (5, 10):
                    chatter_trigger = chatter_trigger or "streak"

        player.credits += reward
        player.experience += xp_awarded
        player.energy = min(player.maxEnergy, player.energy + mission["Required Energy"] // 2)
        # successMessage is a template ("...gaining {reward} credits and
        # {experience} experience.") formatted from the mission's own live
        # values, so the flavor text can never drift out of sync with what
        # was actually awarded - including crits, bounties, and streak
        # bonuses, all folded into the final reward figure.
        message = mission["successMessage"].format(
            reward=reward, experience=xp_awarded
        )
        if xp_awarded < mission["Experience"] or reward_reduced:
            message = (
                f"{message} (Reduced - this mission is below your level; "
                "harder ones pay far more.)"
            )
        # Each extra on its own line: a crit + streak + E.c.h.o. remark
        # jammed into one paragraph read as an unparseable blob in the
        # activity feed (rendered with white-space: pre-line).
        for extra in extras:
            message = f"{message}\n{extra}"
    else:
        # Any failure breaks the streak - that's the tension the streak
        # bonus buys. (Guaranteed missions can't reach this branch.)
        player.win_streak = 0
        refund = int(mission["Required Credits"] * MISSION_FAILURE_REFUND_PCT)
        player.credits += refund
        health_loss = mission["Health Effect"]
        # Armor perk shaves failure damage before the narrow-escape halving.
        if health_loss > 0 and perks["Armor"] > 0:
            health_loss = max(1, round(health_loss * (1 - perks["Armor"])))
        # A ready escort pulls you out of failures lighter, too. The
        # bonus/ESCORT_SUCCESS_MAX ratio is the readiness x home factor.
        escort_factor = escort_bonus(player, mission) / ESCORT_SUCCESS_MAX
        if health_loss > 0 and escort_factor > 0:
            health_loss = max(1, round(
                health_loss * (1 - ESCORT_HEALTH_REDUCTION_MAX * escort_factor)
            ))
        narrow_escape = health_loss > 0 and random.random() < NARROW_ESCAPE_CHANCE
        if narrow_escape:
            health_loss -= health_loss // 2
        player.health -= health_loss
        player.energy = min(player.maxEnergy, player.energy + mission["Required Energy"] // 8)
        if not narrow_escape:
            resolve_mission_equipment_loss(player, mission.get("requiredEquipment"))
        message = mission["failureMessage"]
        if narrow_escape:
            message = (
                f"{message}\nA narrow escape - gear intact, "
                f"only {health_loss} health lost."
            )
            chatter_trigger = "escape"
        if refund > 0:
            message = f"{message} ({refund} credits recovered.)"

    if supplies_note:
        message = f"{message}\n{supplies_note.strip()}"

    if chatter_trigger and random.random() < ECHO_CHATTER_CHANCE:
        message = f"{message}\n{random.choice(ECHO_CHATTER[chatter_trigger])}"

    player.energy = max(0, player.energy)
    apply_level_ups(player)

    # Stats/contracts/achievements run after apply_level_ups so a level
    # gained by this very mission already counts for level-threshold
    # achievements.
    if success:
        goal_entries = bump_stats(
            player,
            missions_won=1,
            credits_earned=reward,
            missions_won_at_level=1 if mission["Rank"] >= player.level else 0,
            best_win_streak=player.win_streak or 0,
        )
    else:
        goal_entries = bump_stats(player, missions_failed=1)

    # Appended here (rather than client-side after the fact) since health
    # only ever drops from this one source - the server already knows the
    # real post-mutation value, so the stored/toasted message is complete
    # and correct without a separate client-side text transform.
    if player.maxHealth and player.health / player.maxHealth <= LOW_HEALTH_RATIO:
        message = f"{message}\n⚠ Health critically low ({player.health}/{player.maxHealth})."

    return success, message, goal_entries
