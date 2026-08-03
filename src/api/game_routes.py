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
from api.models import db, Player, utcnow

game_api = Blueprint('game_api', __name__)

UPGRADE_BASE_COST = 100
UPGRADE_COST_MULTIPLIER = 1.5
UPGRADE_STAT_STEP = 5

UPGRADABLE_STATS = {
    "inventory": "maxInventoryCount",
    "health": "maxHealth",
    "energy": "maxEnergy",
}


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

    total_cost = int(price_row.current_cost * quantity)
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

    db.session.commit()
    return jsonify({"player": player.serialize(), "total_cost": total_cost}), 200


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
    total_value = int(price_row.current_cost * quantity)
    realized_profit = round(total_value - (avg_cost * quantity), 2)

    player.credits += total_value
    inventory = dict(player.inventory or {})
    remaining = current_qty - quantity
    if remaining > 0:
        inventory[item_name] = {"quantity": remaining, "avg_cost": avg_cost}
    else:
        inventory.pop(item_name, None)
    player.inventory = inventory

    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_value": total_value,
        "realized_profit": realized_profit,
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

    player.credits -= total_cost
    equipment = dict(player.equipment or {})
    current_qty = _equipment_qty(player, item_name)
    equipment[item_name] = {"quantity": current_qty + quantity}
    player.equipment = equipment

    db.session.commit()
    return jsonify({"player": player.serialize(), "total_cost": total_cost}), 200


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

    db.session.commit()
    return jsonify({"player": player.serialize(), "total_cost": cost}), 200


def _resolve_mission_request(player, mission_catalog, mission_name, is_story):
    mission = mission_catalog.get(mission_name)
    if not mission:
        return None, (jsonify({"message": "unknown mission"}), 404)

    if is_story:
        story_names = list(mission_catalog.keys())
        unlocked_index = player.storyWins // 5
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

    success, message, died = economy.resolve_mission(player, mission)

    if died:
        lost_credits = economy.apply_death_penalty(player)
        db.session.commit()
        return jsonify({
            "success": False,
            "died": True,
            "message": (
                f"{message} Your health dropped to zero - you were pulled out "
                f"critically injured, losing {lost_credits} credits in the "
                f"process. Level, equipment, and inventory are safe."
            ),
            "player": player.serialize(),
        }), 200

    db.session.commit()
    return jsonify({
        "success": success,
        "died": False,
        "message": message,
        "player": player.serialize(),
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

    success, message, died = economy.resolve_mission(player, mission)

    if success:
        player.storyWins += 1

    if died:
        lost_credits = economy.apply_death_penalty(player)
        db.session.commit()
        return jsonify({
            "success": False,
            "died": True,
            "message": (
                f"{message} Your health dropped to zero - you were pulled out "
                f"critically injured, losing {lost_credits} credits in the "
                f"process. Level, equipment, and inventory are safe."
            ),
            "player": player.serialize(),
        }), 200

    db.session.commit()
    return jsonify({
        "success": success,
        "died": False,
        "message": message,
        "player": player.serialize(),
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

    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "health_gained": health_gain,
        "energy_gained": energy_gain,
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
        return jsonify({"message": "stat must be one of: inventory, health, energy"}), 400

    current_value = getattr(player, field_name)
    cost = math.floor(UPGRADE_BASE_COST * (UPGRADE_COST_MULTIPLIER ** (current_value / 10)))

    if player.credits < cost:
        return jsonify({"message": "insufficient credits"}), 400

    player.credits -= cost
    setattr(player, field_name, current_value + UPGRADE_STAT_STEP)

    db.session.commit()
    return jsonify({"player": player.serialize(), "cost": cost}), 200


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
    player.storyWins = 0
    player.item_cooldowns = {}
    player.last_tick_at = utcnow()


@game_api.route('/player/reset', methods=['POST'])
@jwt_required()
def reset_player():
    player, err = _player_or_404()
    if err:
        return err
    _reset_player(player)
    db.session.commit()
    return jsonify({"player": player.serialize()}), 200
