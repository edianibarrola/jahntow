"""
Server-side, authoritative game economy: market prices, passive regen/
production, mission resolution, and levelling. Every player action that
changes credits, stats, inventory, or experience is computed here instead
of trusting values sent by the client.
"""
import random
from datetime import timedelta

from api.models import db, MarketPrice, utcnow
from api import game_data

# How often shared market prices are allowed to drift, and by how much.
PRICE_TICK_INTERVAL = timedelta(seconds=30)
PRICE_DRIFT_PCT = 0.10          # +/-10% random walk per tick
PRICE_REVERT_THRESHOLD_PCT = 0.50  # snap back to base once drifted this far

# Passive regen/production tick, applied lazily based on elapsed time.
ENERGY_REGEN_INTERVAL = timedelta(seconds=10)
ENERGY_REGEN_AMOUNT = 1
PROPERTY_PRODUCTION_INTERVAL = timedelta(seconds=30)

# Base XP required to reach the next level = level * XP_PER_LEVEL.
XP_PER_LEVEL = 100
# Credits granted per level gained.
LEVEL_UP_CREDIT_BONUS = 1000

# Mission success chance scales with how prepared the player actually is,
# instead of being a flat coin flip regardless of level or gear:
#   - BASE_SUCCESS_CHANCE is what you get right at a mission's own rank
#     (still a real risk - the mission is new to you).
#   - Each level above the mission's rank improves your odds; each level
#     below (possible for story missions, which aren't level-gated)
#     worsens them.
#   - Owning more than the bare minimum of required equipment also helps,
#     capped so gear alone can't trivialize a mission.
BASE_SUCCESS_CHANCE = 0.5
SUCCESS_PER_LEVEL_ADVANTAGE = 0.03
SUCCESS_PER_EXTRA_EQUIPMENT = 0.02
MAX_EQUIPMENT_BONUS = 0.10
MIN_SUCCESS_CHANCE = 0.15
MAX_SUCCESS_CHANCE = 0.92


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


def get_market_prices():
    apply_price_ticks()
    rows = MarketPrice.query.order_by(MarketPrice.category, MarketPrice.item_name).all()
    return [row.serialize() for row in rows]


def get_item_price(item_name):
    apply_price_ticks()
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


def apply_passive_tick(player):
    """
    Apply energy regen and property-based item production for whatever
    wall-clock time has passed since the player was last ticked. Called
    at the top of every authenticated player action so state stays correct
    even if the player was offline (no client-side interval required).
    """
    now = utcnow()
    last = player.last_tick_at or now
    elapsed = now - last
    if elapsed <= timedelta(0):
        return

    changed = False

    # Energy regen: +1 per ENERGY_REGEN_INTERVAL, capped at maxEnergy.
    if player.energy < player.maxEnergy:
        ticks = int(elapsed / ENERGY_REGEN_INTERVAL)
        if ticks > 0:
            player.energy = min(player.maxEnergy, player.energy + ticks * ENERGY_REGEN_AMOUNT)
            changed = True

    # Property production: each owned property generates its item at its
    # configured rate per PROPERTY_PRODUCTION_INTERVAL, capped at
    # maxInventoryCount per item (unowned/zero-quantity properties produce
    # nothing).
    production_ticks = int(elapsed / PROPERTY_PRODUCTION_INTERVAL)
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
            current_qty = inventory.get(generated_item, {}).get("quantity", 0)
            if current_qty >= player.maxInventoryCount:
                continue
            gained = owned_qty * rate * production_ticks
            new_qty = min(player.maxInventoryCount, current_qty + gained)
            if new_qty != current_qty:
                inventory[generated_item] = {"quantity": new_qty}
                changed = True
        if changed:
            player.inventory = inventory

    player.last_tick_at = now
    if changed:
        db.session.add(player)


def apply_level_ups(player):
    """
    Grant every level the player's current experience qualifies for (fixes
    the old client logic, which only ever granted one level per call and
    discarded any XP above the threshold instead of carrying it forward).
    """
    leveled_up = False
    while True:
        xp_needed = player.level * XP_PER_LEVEL
        if player.experience < xp_needed:
            break
        player.experience -= xp_needed
        player.level += 1
        player.credits += player.level * LEVEL_UP_CREDIT_BONUS
        leveled_up = True
    return leveled_up


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
    chance = BASE_SUCCESS_CHANCE + level_advantage * SUCCESS_PER_LEVEL_ADVANTAGE

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
    Here, "Required Credits" is the entry cost (spent whether the mission
    succeeds or fails) and "Reward" is the actual payout on success, which
    is what the mission data and its own successMessage text always implied.

    Health can only ever drop here, from a failure's "Health Effect", and
    player_meets_requirements already refuses to start a mission whose
    Health Effect could take the player to 0 - so a mission attempt can
    never end in death.
    """
    player.credits -= mission["Required Credits"]
    player.energy -= mission["Required Energy"]

    success = random.random() < mission_success_chance(player, mission)

    if success:
        player.credits += mission["Reward"]
        player.experience += mission["Experience"]
        player.energy = min(player.maxEnergy, player.energy + mission["Required Energy"] // 2)
        message = mission["successMessage"]
    else:
        player.health -= mission["Health Effect"]
        player.energy = min(player.maxEnergy, player.energy + mission["Required Energy"] // 8)
        resolve_mission_equipment_loss(player, mission.get("requiredEquipment"))
        message = mission["failureMessage"]

    player.energy = max(0, player.energy)
    apply_level_ups(player)

    return success, message
