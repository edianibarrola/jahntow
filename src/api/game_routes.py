"""
Authoritative game-action endpoints. Every one of these computes its
outcome (prices, costs, rewards, XP, cooldowns) on the server from
api/game_data.py + api/economy.py and persists only the result - the
client sends an intent ("buy 3 Alpha Cores", "start Asteroid Mining") and
never the outcome itself.
"""
import math
from datetime import timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from api import economy, game_data
from api.models import db, Player, ActivityLogEntry, utcnow

game_api = Blueprint('game_api', __name__)

UPGRADE_BASE_COST = 250
UPGRADE_COST_MULTIPLIER = 1.35
UPGRADE_STAT_STEP = 5

UPGRADABLE_STATS = {
    "inventory": "maxInventoryCount",
    "health": "maxHealth",
    "energy": "maxEnergy",
    "equipment": "maxEquipmentCount",
}

# Refund fraction when selling equipment back.
EQUIPMENT_SELL_REFUND_PCT = 0.5

# Wins needed on the current story mission before the next one unlocks.
# Was 5, which meant replaying the same mission 5 times for each of 42
# chapters - 210 identical repetitions to see the whole story.
STORY_WINS_PER_UNLOCK = 2


def _current_player():
    user_id = int(get_jwt_identity())
    return Player.query.filter(Player.user_id == user_id).first()


def _player_or_404():
    player = _current_player()
    if not player:
        return None, (jsonify({"message": "Player not found"}), 404)
    return player, None


def _inventory_qty(player, item_name):
    return (player.inventory or {}).get(item_name, {}).get("quantity", 0)


def _equipment_qty(player, item_name):
    return (player.equipment or {}).get(item_name, {}).get("quantity", 0)


def _equipment_total(player):
    """Total units held across all equipment types - what maxEquipmentCount caps."""
    return sum(
        entry.get("quantity", 0) for entry in (player.equipment or {}).values()
    )


@game_api.route('/game-data', methods=['GET'])
def get_game_data():
    """Static catalog data, identical for every player. No auth required."""
    return jsonify({
        "items": game_data.ITEMS,
        "missions": game_data.MISSIONS,
        "storyMissions": game_data.STORY_MISSIONS,
        "properties": game_data.PROPERTIES,
        "equipment": game_data.EQUIPMENT,
        "healthRecoveryItems": game_data.HEALTH_RECOVERY_ITEMS,
    }), 200


@game_api.route('/market/prices', methods=['GET'])
def get_market_prices():
    """Shared, global item prices - identical for every player at any moment."""
    return jsonify({"prices": economy.get_market_prices()}), 200


@game_api.route('/events/active', methods=['GET'])
def active_events():
    """No auth required. Every currently active category-wide price event -
    same shared/global concept as market prices. Several can run at once
    (one per category); the old singular version only ever reported the
    newest, so any others silently vanished from the UI while still
    affecting nothing."""
    events = economy.apply_event_ticks()
    return jsonify({"events": [e.serialize() for e in events]}), 200


@game_api.route('/market/history', methods=['GET'])
def market_history():
    """No auth required. Rolling price series per item for the chart."""
    return jsonify({"history": economy.get_price_history()}), 200


@game_api.route('/player/activity', methods=['GET'])
@jwt_required()
def player_activity():
    """The current player's own recent activity log - follows the account,
    not the browser, unlike the old localStorage-only version."""
    player, err = _player_or_404()
    if err:
        return err
    entries = economy.get_player_activity(player)
    return jsonify({"entries": [e.serialize() for e in entries]}), 200


@game_api.route('/notifications', methods=['GET'])
def notifications():
    """No auth required. Global price-change feed - same shared scope as
    market prices, not tied to any one player."""
    entries = economy.get_global_notifications()
    return jsonify({"entries": [e.serialize() for e in entries]}), 200


LEADERBOARD_SIZE = 20


@game_api.route('/leaderboard', methods=['GET'])
def leaderboard():
    """
    No auth required, same as game-data/market-prices. Ranked by prestige
    first, then level, then credits - a player who's rebirthed several
    times outranks one sitting on a big credits pile with no prestige,
    since that's what prestiging is meant to represent.
    """
    players = (
        Player.query
        .order_by(Player.prestige_level.desc(), Player.level.desc(), Player.credits.desc())
        .limit(LEADERBOARD_SIZE)
        .all()
    )
    return jsonify({"players": [p.serialize_public() for p in players]}), 200


@game_api.route('/market/buy', methods=['POST'])
@jwt_required()
def market_buy():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    item_name = data.get("item_name")
    quantity = data.get("quantity")

    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"message": "quantity must be a positive integer"}), 400

    category, catalog_item = economy.find_catalog_item(item_name)
    if not catalog_item:
        return jsonify({"message": "unknown item"}), 404
    if catalog_item["Rank"] > player.level:
        return jsonify({"message": "your level is too low for this item"}), 403

    price_row = economy.get_item_price(item_name)
    if not price_row:
        return jsonify({"message": "unknown item"}), 404

    total_cost = int(economy.get_buy_price(price_row) * quantity)
    existing = (player.inventory or {}).get(item_name, {})
    current_qty = existing.get("quantity", 0)
    current_avg_cost = existing.get("avg_cost", 0)

    if current_qty + quantity > player.maxInventoryCount:
        return jsonify({"message": "not enough inventory space"}), 400
    if player.credits < total_cost:
        return jsonify({"message": "insufficient credits"}), 400

    player.credits -= total_cost
    new_qty = current_qty + quantity
    # Moving average cost basis: weight the existing holdings' average cost
    # against this purchase's actual price, so a player who bought some
    # stock cheap and some expensive sees one blended number, not just the
    # latest price.
    new_avg_cost = round(
        ((current_avg_cost * current_qty) + total_cost) / new_qty, 2
    )
    inventory = dict(player.inventory or {})
    inventory[item_name] = {"quantity": new_qty, "avg_cost": new_avg_cost}
    player.inventory = inventory

    activity = economy.log_activity(
        player, f"Bought {quantity}x {item_name} for {total_cost} credits.", "buy"
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": total_cost,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/market/sell', methods=['POST'])
@jwt_required()
def market_sell():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    item_name = data.get("item_name")
    quantity = data.get("quantity")

    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"message": "quantity must be a positive integer"}), 400

    existing = (player.inventory or {}).get(item_name, {})
    current_qty = existing.get("quantity", 0)
    if current_qty < quantity:
        return jsonify({"message": "insufficient quantity"}), 400

    price_row = economy.get_item_price(item_name)
    if not price_row:
        return jsonify({"message": "unknown item"}), 404

    avg_cost = existing.get("avg_cost", 0)
    total_value = int(economy.get_sell_price(price_row) * quantity)
    realized_profit = round(total_value - (avg_cost * quantity), 2)

    player.credits += total_value
    inventory = dict(player.inventory or {})
    remaining = current_qty - quantity
    if remaining > 0:
        inventory[item_name] = {"quantity": remaining, "avg_cost": avg_cost}
    else:
        inventory.pop(item_name, None)
    player.inventory = inventory

    if realized_profit > 0:
        profit_text = f" (+{realized_profit} profit)"
    elif realized_profit < 0:
        profit_text = f" ({realized_profit} loss)"
    else:
        profit_text = ""
    activity = economy.log_activity(
        player,
        f"Sold {quantity}x {item_name} for {total_value} credits{profit_text}.",
        "sell",
    )

    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_value": total_value,
        "realized_profit": realized_profit,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/equipment/buy', methods=['POST'])
@jwt_required()
def equipment_buy():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    item_name = data.get("item_name")
    quantity = data.get("quantity")

    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"message": "quantity must be a positive integer"}), 400

    category, equipment_data = economy.find_equipment(item_name)
    if not equipment_data:
        return jsonify({"message": "unknown equipment"}), 404
    if player.level < equipment_data["Required Level"]:
        return jsonify({"message": "your level is too low for this equipment"}), 403

    total_cost = equipment_data["Base Cost"] * quantity
    if player.credits < total_cost:
        return jsonify({"message": "insufficient credits"}), 400

    # Equipment was the only uncapped resource in the game - market items
    # have always been bounded by maxInventoryCount, but you could stockpile
    # unlimited gear, well past the point where surplus stops helping.
    held_total = _equipment_total(player)
    capacity = player.maxEquipmentCount or 0
    if held_total + quantity > capacity:
        return jsonify({
            "message": f"not enough equipment storage ({held_total}/{capacity} used)"
        }), 400

    player.credits -= total_cost
    equipment = dict(player.equipment or {})
    current_qty = _equipment_qty(player, item_name)
    equipment[item_name] = {"quantity": current_qty + quantity}
    player.equipment = equipment

    activity = economy.log_activity(
        player, f"Bought {quantity}x {item_name} for {total_cost} credits.", "buy"
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": total_cost,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/equipment/sell', methods=['POST'])
@jwt_required()
def equipment_sell():
    """
    Sell equipment back at a partial refund. Equipment used to be a
    one-way credit sink with no way to recover from over-buying, which is
    harsh now that storage is capped.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    item_name = data.get("item_name")
    quantity = data.get("quantity")

    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"message": "quantity must be a positive integer"}), 400

    category, equipment_data = economy.find_equipment(item_name)
    if not equipment_data:
        return jsonify({"message": "unknown equipment"}), 404

    current_qty = _equipment_qty(player, item_name)
    if current_qty < quantity:
        return jsonify({"message": "insufficient quantity"}), 400

    total_value = int(equipment_data["Base Cost"] * EQUIPMENT_SELL_REFUND_PCT) * quantity
    player.credits += total_value

    equipment = dict(player.equipment or {})
    remaining = current_qty - quantity
    if remaining > 0:
        equipment[item_name] = {"quantity": remaining}
    else:
        equipment.pop(item_name, None)
    player.equipment = equipment

    activity = economy.log_activity(
        player, f"Sold {quantity}x {item_name} for {total_value} credits.", "sell"
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_value": total_value,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/properties/buy', methods=['POST'])
@jwt_required()
def properties_buy():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    property_name = data.get("property_name")

    category, property_data = economy.find_property(property_name)
    if not property_data:
        return jsonify({"message": "unknown property"}), 404
    if player.level < property_data["Rank"]:
        return jsonify({"message": "your level is too low for this property"}), 403
    if (player.properties or {}).get(property_name, 0) > 0:
        return jsonify({"message": "you already own this property"}), 400

    cost = property_data["Base Cost"]
    if player.credits < cost:
        return jsonify({"message": "insufficient credits"}), 400

    player.credits -= cost
    properties = dict(player.properties or {})
    properties[property_name] = 1
    player.properties = properties

    activity = economy.log_activity(
        player, f"Purchased {property_name} for {cost} credits.", "property"
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": cost,
        "activity": activity.serialize(),
    }), 200


def _resolve_mission_request(player, mission_catalog, mission_name, is_story):
    mission = mission_catalog.get(mission_name)
    if not mission:
        return None, (jsonify({"message": "unknown mission"}), 404)

    if is_story:
        story_names = list(mission_catalog.keys())
        unlocked_index = player.storyWins // STORY_WINS_PER_UNLOCK
        if unlocked_index >= len(story_names) or story_names[unlocked_index] != mission_name:
            return None, (jsonify({"message": "this story mission is not unlocked yet"}), 403)
    else:
        if mission["Rank"] > player.level:
            return None, (jsonify({"message": "your level is too low for this mission"}), 403)

    ok, reason = economy.player_meets_requirements(player, mission)
    if not ok:
        return None, (jsonify({"message": reason}), 400)

    return mission, None


@game_api.route('/mission/start', methods=['POST'])
@jwt_required()
def mission_start():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    mission_name = data.get("mission_name")

    mission, err = _resolve_mission_request(player, game_data.MISSIONS, mission_name, is_story=False)
    if err:
        return err

    success, message = economy.resolve_mission(player, mission)
    activity = economy.log_activity(
        player, message, "mission-success" if success else "mission-fail"
    )

    db.session.commit()
    return jsonify({
        "success": success,
        "message": message,
        "player": player.serialize(),
        "activity": activity.serialize(),
    }), 200


@game_api.route('/story-mission/start', methods=['POST'])
@jwt_required()
def story_mission_start():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    mission_name = data.get("mission_name")

    mission, err = _resolve_mission_request(player, game_data.STORY_MISSIONS, mission_name, is_story=True)
    if err:
        return err

    success, message = economy.resolve_mission(player, mission)

    if success:
        player.storyWins += 1

    activity = economy.log_activity(
        player, message, "mission-success" if success else "mission-fail"
    )

    db.session.commit()
    return jsonify({
        "success": success,
        "message": message,
        "player": player.serialize(),
        "activity": activity.serialize(),
    }), 200


@game_api.route('/recovery/use', methods=['POST'])
@jwt_required()
def recovery_use():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    item_name = data.get("item_name")

    category, item_data = economy.find_recovery_item(item_name)
    if not item_data:
        return jsonify({"message": "unknown recovery item"}), 404
    if item_data["Rank"] > player.level:
        return jsonify({"message": "your level is too low for this item"}), 403

    cooldowns = dict(player.item_cooldowns or {})
    last_used_iso = cooldowns.get(item_name)
    now = utcnow()
    if last_used_iso:
        from datetime import datetime
        last_used = datetime.fromisoformat(last_used_iso)
        cooldown_remaining = timedelta(seconds=item_data["Cooldown"]) - (now - last_used)
        if cooldown_remaining > timedelta(0):
            return jsonify({
                "message": "this item is on cooldown",
                "retry_after_seconds": round(cooldown_remaining.total_seconds(), 1),
            }), 429

    needs_health = category in ("Health", "Combo") and item_data["Health Gain"] > 0
    needs_energy = category in ("Energy", "Combo") and item_data["Energy Gain"] > 0

    if needs_health and player.health >= player.maxHealth and not needs_energy:
        return jsonify({"message": "health is already full"}), 400
    if needs_energy and player.energy >= player.maxEnergy and not needs_health:
        return jsonify({"message": "energy is already full"}), 400
    if needs_health and needs_energy and player.health >= player.maxHealth and player.energy >= player.maxEnergy:
        return jsonify({"message": "health and energy are already full"}), 400

    if player.credits < item_data["Cost"]:
        return jsonify({"message": "insufficient credits"}), 400

    health_gain = min(item_data["Health Gain"], player.maxHealth - player.health)
    energy_gain = min(item_data["Energy Gain"], player.maxEnergy - player.energy)

    player.credits -= item_data["Cost"]
    player.health += health_gain
    player.energy += energy_gain
    cooldowns[item_name] = now.isoformat()
    player.item_cooldowns = cooldowns

    activity = economy.log_activity(
        player,
        f"Used {item_name}: +{health_gain} health, +{energy_gain} energy.",
        "recovery",
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "health_gained": health_gain,
        "energy_gained": energy_gain,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/upgrade', methods=['POST'])
@jwt_required()
def upgrade_stat():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    stat = data.get("stat")

    field_name = UPGRADABLE_STATS.get(stat)
    if not field_name:
        return jsonify({
            "message": "stat must be one of: " + ", ".join(sorted(UPGRADABLE_STATS))
        }), 400

    # Cost keys off how many upgrades you've *bought* for this stat, not the
    # raw stat value. Keying off the value meant stats starting at different
    # bases priced wildly differently (inventory from 10 was near-free while
    # health/energy from 100 cost more than a starting bankroll for +5), and
    # it meant prestige - which raises the max-stat floor - retroactively
    # made your next upgrade ~2.25x more expensive. Levelling now raises
    # those floors too, which would have compounded the same problem.
    steps = dict(player.upgrade_steps or {})
    purchased = steps.get(stat, 0)
    cost = math.floor(UPGRADE_BASE_COST * (UPGRADE_COST_MULTIPLIER ** purchased))

    if player.credits < cost:
        return jsonify({"message": "insufficient credits"}), 400

    current_value = getattr(player, field_name)
    player.credits -= cost
    setattr(player, field_name, current_value + UPGRADE_STAT_STEP)
    steps[stat] = purchased + 1
    player.upgrade_steps = steps

    activity = economy.log_activity(player, f"Upgraded {stat} for {cost} credits.", "upgrade")
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "cost": cost,
        "activity": activity.serialize(),
    }), 200


def _reset_tick_clocks(player):
    """
    Reset every passive-resource clock together. Each resource carries its
    own remainder, so leaving any of them stale after a reset/prestige
    would dump banked gains the moment the player acts.
    """
    now = utcnow()
    player.last_tick_at = now
    player.last_energy_tick_at = now
    player.last_health_tick_at = now
    player.last_production_tick_at = now
    player.last_trickle_at = now


def _reset_player(player):
    player.level = 1
    player.experience = 0
    player.health = 100
    player.energy = 100
    player.credits = 5000
    player.equipment = {}
    player.inventory = {}
    player.properties = {}
    player.maxInventoryCount = 10
    player.maxHealth = 100
    player.maxEnergy = 100
    player.maxEquipmentCount = 20
    player.storyWins = 0
    player.item_cooldowns = {}
    player.upgrade_steps = {}
    _reset_tick_clocks(player)


@game_api.route('/player/reset', methods=['POST'])
@jwt_required()
def reset_player():
    player, err = _player_or_404()
    if err:
        return err
    _reset_player(player)
    # Wipe this player's own activity history along with everything else -
    # global price notifications are untouched, they're not this player's
    # data.
    ActivityLogEntry.query.filter_by(player_id=player.id).delete()
    db.session.commit()
    return jsonify({"player": player.serialize()}), 200


def _prestige_player(player):
    """
    Like _reset_player, but deliberately different in two ways: storyWins
    is preserved (narrative/story-mission unlock progress is a different
    axis from the economy and shouldn't be lost on rebirth), and the
    max-stat floor scales up with prestige_level instead of resetting to
    the flat base - each rebirth permanently raises the ceiling.
    """
    # Coalesce None: SQLAlchemy column defaults only apply to new INSERTs,
    # not existing rows from before this column was migrated in, so an
    # older player's prestige_level can still be NULL here.
    player.prestige_level = (player.prestige_level or 0) + 1
    player.level = 1
    player.experience = 0
    player.credits = 5000
    player.equipment = {}
    player.inventory = {}
    player.properties = {}
    player.maxInventoryCount = 10 + player.prestige_level * economy.PRESTIGE_MAX_INVENTORY_BONUS
    player.maxHealth = 100 + player.prestige_level * economy.PRESTIGE_MAX_HEALTH_BONUS
    player.maxEnergy = 100 + player.prestige_level * economy.PRESTIGE_MAX_ENERGY_BONUS
    player.maxEquipmentCount = 20 + player.prestige_level * economy.PRESTIGE_MAX_EQUIPMENT_BONUS
    player.health = player.maxHealth
    player.energy = player.maxEnergy
    player.item_cooldowns = {}
    # Purchased-upgrade counters reset with the run. Keeping them would
    # mean every post-prestige upgrade started at the old escalated price -
    # the same anti-synergy that keying cost off the raw stat value caused.
    player.upgrade_steps = {}
    _reset_tick_clocks(player)


@game_api.route('/prestige', methods=['POST'])
@jwt_required()
def prestige():
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)
    if player.level < economy.MAX_LEVEL:
        return jsonify({"message": f"Reach level {economy.MAX_LEVEL} to prestige"}), 400
    _prestige_player(player)
    activity = economy.log_activity(
        player,
        f"Prestiged to level {player.prestige_level}! Stats reset, but your max "
        "Health/Energy/Inventory floor is now permanently higher.",
        "prestige",
    )
    db.session.commit()
    return jsonify({"player": player.serialize(), "activity": activity.serialize()}), 200
