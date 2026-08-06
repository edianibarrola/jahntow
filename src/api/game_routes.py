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

# These upgrades are presented as ship systems (the Upgrades tab was folded
# into the Ship tab), so the activity log has to name them the way the tab
# does - "Upgraded inventory" matched nothing the player could see.
STAT_DISPLAY_NAMES = {
    "inventory": "Cargo Bay",
    "health": "Life Support",
    "energy": "Capacitor",
    "equipment": "Armory",
}

# Refund fraction when selling equipment back.
EQUIPMENT_SELL_REFUND_PCT = 0.5

# Properties can be upgraded past level 1: the stored value in
# player.properties is the level, and the passive tick already computes
# owned_qty * rate, so a level-2 property produces double with zero tick
# changes. Upgrade cost escalates from the property's own Base Cost.
PROPERTY_MAX_LEVEL = 3
PROPERTY_UPGRADE_COST_MULTIPLIER = 1.25

# Most attempts one /mission/start call may batch (the "Run x5" button).
# Small on purpose: a batch is a convenience for the constant player, not
# an automation primitive.
MISSION_REPEAT_CAP = 5

# Wins needed on the current story mission before the next one unlocks.
# Deliberately equal to the number of narrative beats authored per chapter
# in storyMissionArc (flux.js): each win reveals the next part of that
# mission's story, so the two must stay in step. Lowering this without
# also changing how the arc is authored means beats get skipped or the
# text stops matching the mission being played.
STORY_WINS_PER_UNLOCK = 5


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
        # Static achievement catalog - the client needs it to render the
        # locked entries in the Goals tab (the player row only carries
        # earned ids). Chains let the UI show one advancing goal per
        # progression instead of every tier at once.
        "achievements": game_data.ACHIEVEMENTS,
        "achievementChains": game_data.ACHIEVEMENT_CHAINS,
        "shipModules": game_data.SHIP_MODULES,
        # Region -> storyWins gate, so the client can group ops by land
        # and show what the story hasn't opened yet (server enforces).
        "regions": game_data.REGIONS,
        # Warband catalog + story gates: names, captains, costs, unlock
        # points - the client renders and cost-previews from this, the
        # server owns every transaction and gate.
        "warbands": game_data.WARBANDS,
        "storyWarbandGates": game_data.STORY_WARBAND_GATES,
        "shipModuleMaxLevel": game_data.SHIP_MODULE_MAX_LEVEL,
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
    No auth required, same as game-data/market-prices. Ranked by the
    composite renown score (see Player.renown_score), which weighs
    prestige, level, story progress, achievements, reputation, streaks and
    - logarithmically - credits.

    Sorted in Python rather than SQL because the score reads JSON columns
    (achievements, reputation, stats) that no portable ORDER BY can reach.
    The player table is small and this endpoint is cheap; if it ever isn't,
    the score wants to become a persisted, incrementally-updated column.
    """
    players = sorted(
        Player.query.all(), key=lambda p: p.renown_score(), reverse=True
    )[:LEADERBOARD_SIZE]
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
    # Trading was the only activity in the game that granted no experience,
    # which left a trade-focused player stuck at level 1 and locked out of
    # the better goods that make trading pay at all.
    trade_xp = economy.trade_xp_award(player, realized_profit)
    if trade_xp > 0:
        player.experience += trade_xp
        economy.apply_level_ups(player)

    activity = economy.log_activity(
        player,
        f"Sold {quantity}x {item_name} for {total_value} credits{profit_text}."
        + (f" (+{trade_xp} XP)" if trade_xp else ""),
        "sell",
    )
    goal_entries = economy.bump_stats(
        player, items_sold=quantity, credits_earned=total_value
    )

    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_value": total_value,
        "realized_profit": realized_profit,
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
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

    # A traveling merchant event discounts this category's Base Cost for a
    # few minutes. Applied here at transaction time (like price events on
    # market items) so it needs no cleanup when the event expires. Faction
    # reputation stacks its own per-player trade discount on top.
    merchant_factor = economy.get_merchant_price_factor(category)
    rep_off = economy.rep_discount(player)
    unit_cost = equipment_data["Base Cost"]
    if merchant_factor < 1:
        unit_cost = max(1, round(unit_cost * merchant_factor))
    if rep_off > 0:
        unit_cost = max(1, round(unit_cost * (1 - rep_off)))
    total_cost = unit_cost * quantity
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

    notes = []
    if merchant_factor < 1:
        notes.append(f"merchant discount: {round((1 - merchant_factor) * 100)}% off")
    if rep_off > 0:
        notes.append(f"ally discount: {round(rep_off * 100)}% off")
    bought_note = f" ({', '.join(notes)})" if notes else ""
    activity = economy.log_activity(
        player,
        f"Bought {quantity}x {item_name} for {total_cost} credits.{bought_note}",
        "buy",
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

    # The refund tracks the item's CURRENT value, not its static Base
    # Cost. Refunding a flat 50% of base while a traveling merchant sold
    # the same item at 40-60% off was a money printer: buy at 24 during a
    # 52%-off sale, sell straight back for 25, repeat forever.
    #
    # The personal reputation discount is deliberately NOT applied here -
    # it's a buying perk, and folding it into the refund too would let it
    # cancel out. Buying costs Base * merchant * (1 - rep) and selling
    # returns Base * merchant * 0.5, so a round trip loses money for any
    # rep discount below 50% (the cap is 10%).
    merchant_factor = economy.get_merchant_price_factor(category)
    unit_value = equipment_data["Base Cost"] * merchant_factor
    total_value = int(unit_value * EQUIPMENT_SELL_REFUND_PCT) * quantity
    player.credits += total_value

    equipment = dict(player.equipment or {})
    remaining = current_qty - quantity
    if remaining > 0:
        equipment[item_name] = {"quantity": remaining}
    else:
        equipment.pop(item_name, None)
    player.equipment = equipment

    sale_note = (
        " (reduced while a merchant is flooding the market)"
        if merchant_factor < 1 else ""
    )
    activity = economy.log_activity(
        player,
        f"Sold {quantity}x {item_name} for {total_value} credits.{sale_note}",
        "sell",
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

    # The stored value is the property's level: first purchase sets it to
    # 1, repeat purchases upgrade it (cost escalating per level) up to
    # PROPERTY_MAX_LEVEL. Output scales with level automatically since the
    # passive tick multiplies rate by this value.
    properties = dict(player.properties or {})
    current_level = properties.get(property_name, 0)
    if current_level >= PROPERTY_MAX_LEVEL:
        return jsonify({"message": "this property is already at max level"}), 400

    if current_level > 0:
        cost = int(property_data["Base Cost"] * PROPERTY_UPGRADE_COST_MULTIPLIER ** current_level)
        action_text = f"Upgraded {property_name} to level {current_level + 1}"
    else:
        cost = property_data["Base Cost"]
        action_text = f"Purchased {property_name}"

    if player.credits < cost:
        return jsonify({"message": "insufficient credits"}), 400

    player.credits -= cost
    properties[property_name] = current_level + 1
    player.properties = properties

    activity = economy.log_activity(
        player, f"{action_text} for {cost} credits.", "property"
    )
    # No stat counter moves on a property buy, but properties_owned
    # achievements need a check right when the count changes.
    goal_entries = economy.check_achievements(player)
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": cost,
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
    }), 200


@game_api.route('/ship/upgrade', methods=['POST'])
@jwt_required()
def ship_upgrade():
    """
    Install the next level of a ship module.

    This is the only place credits buy a RATE rather than a capacity, which
    is why it exists: energy regen was a fixed 360/hour for the whole game
    while mission costs climb with rank, so play got slower the further you
    got and a large balance bought nothing that changed it.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    module_id = data.get("module_id")

    module = game_data.SHIP_MODULES.get(module_id)
    if not module:
        return jsonify({"message": "unknown ship module"}), 404

    cost = economy.ship_module_cost(player, module_id)
    if cost is None:
        return jsonify({"message": "this module is already at max level"}), 400
    if player.credits < cost:
        return jsonify({"message": "insufficient credits"}), 400

    ship = dict(player.ship or {})
    new_level = ship.get(module_id, 0) + 1
    ship[module_id] = new_level
    player.ship = ship
    player.credits -= cost

    activity = economy.log_activity(
        player,
        f"Installed {module['name']} level {new_level} for {cost} credits.",
        "ship",
    )
    goal_entries = economy.check_achievements(player)
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": cost,
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
    }), 200


@game_api.route('/properties/collect', methods=['POST'])
@jwt_required()
def properties_collect():
    """
    Move goods produced by properties out of the uncollected pool and into
    the inventory, bounded by maxInventoryCount per item.

    Production used to be written straight into the inventory, which let a
    cap of 10 quietly hold 50 and left a bought property with no further
    interaction. Collecting makes the cap real (it is the limit on what
    you can hold at once) and gives properties a loop: they fill, you come
    back, you collect and sell.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    pending = economy.migrate_pending_to_properties(player)
    if not pending:
        return jsonify({"message": "nothing to collect"}), 400

    # Collect one property, or all of them. Per-property claiming exists
    # because a single "collect everything" button drained the stores in an
    # order the player couldn't control - and with the inventory cap
    # bounding each trip, that meant repeatedly clearing one property's
    # goods before ever reaching the next.
    data = request.get_json(silent=True) or {}
    only = data.get("property_name")
    if only is not None and only not in pending:
        return jsonify({"message": "that property has nothing to collect"}), 400
    targets = [only] if only else list(pending.keys())

    inventory = dict(player.inventory or {})
    collected = {}
    for property_name in targets:
        available = math.floor(pending.get(property_name, 0))
        _, property_data = economy.find_property(property_name)
        if available <= 0 or not property_data:
            continue
        item_name = property_data["Item Generated"]
        entry = inventory.get(item_name, {})
        current_qty = entry.get("quantity", 0)
        space = player.maxInventoryCount - current_qty
        take = min(available, space)
        if take <= 0:
            continue
        # Claimed goods enter at the CURRENT market sell value, not zero.
        # A zero basis made every later sale count as pure "profit", and
        # since trading profit now pays XP, a big property empire was
        # measured leveling its owner 753 XP/hour with no play at all.
        # Valued at claim price, selling claimed goods only realizes
        # profit the market has actually moved since the claim.
        price_row = economy.get_item_price(item_name)
        claim_value = round(economy.get_sell_price(price_row), 2) if price_row else 0
        new_qty = current_qty + take
        inventory[item_name] = {
            "quantity": new_qty,
            "avg_cost": round(
                (entry.get("avg_cost", 0) * current_qty + claim_value * take)
                / new_qty, 2)
            if new_qty else 0,
        }
        remaining = pending[property_name] - take
        if remaining > 0:
            pending[property_name] = remaining
        else:
            pending.pop(property_name, None)
        collected[item_name] = collected.get(item_name, 0) + take

    if not collected:
        return jsonify({
            "message": "no inventory space - sell something first"
        }), 400

    player.inventory = inventory
    player.pending_production = pending

    summary = ", ".join(f"{qty}x {name}" for name, qty in collected.items())
    left = sum(math.floor(v) for v in pending.values())
    note = f" ({left} still waiting - free up space to collect the rest.)" if left else ""
    activity = economy.log_activity(
        player, f"Collected {summary} from your properties.{note}", "property"
    )
    goal_entries = economy.check_achievements(player)
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "collected": collected,
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
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
    # Optional batched attempts: the single most-repeated action in the
    # game was one click per ~35 seconds of identical clicking. The loop
    # re-validates requirements before EVERY attempt (energy, credits,
    # health, supplies all change mid-batch) and stops at the first one
    # that fails, so a batch can never do anything N single calls couldn't.
    repeat = data.get("repeat", 1)
    if not isinstance(repeat, int) or not 1 <= repeat <= MISSION_REPEAT_CAP:
        return jsonify({
            "message": f"repeat must be an integer from 1 to {MISSION_REPEAT_CAP}"
        }), 400

    mission, err = _resolve_mission_request(player, game_data.MISSIONS, mission_name, is_story=False)
    if err:
        return err

    results = []
    goal_entries = []
    credits_before = player.credits
    level_before = player.level
    stopped_because = None
    for attempt in range(repeat):
        if attempt > 0:
            mission, stop_err = _resolve_mission_request(
                player, game_data.MISSIONS, mission_name, is_story=False
            )
            if stop_err:
                stopped_because = stop_err[0].get_json().get("message")
                break
        success, message, entries = economy.resolve_mission(
            player, mission, mission_name=mission_name
        )
        results.append((success, message))
        goal_entries.extend(entries)

    wins = sum(1 for s, _ in results if s)
    if len(results) == 1:
        success, message = results[0]
    else:
        # One summary line for the log; the per-run flavor (crits,
        # bounties, streaks) still rides in `messages` for the response.
        success = wins > 0
        delta = player.credits - credits_before
        message = (
            f"Ran {mission_name} x{len(results)}: {wins} won, "
            f"{len(results) - wins} lost, {'+' if delta >= 0 else ''}"
            f"{delta:,} credits."
        )
        if player.level > level_before:
            message = f"{message} Level {level_before} → {player.level}!"
        if stopped_because:
            message = f"{message} (Stopped early: {stopped_because})"
    activity = economy.log_activity(
        player, message, "mission-success" if success else "mission-fail"
    )

    db.session.commit()
    return jsonify({
        "success": success,
        "message": message,
        "attempts": len(results),
        "wins": wins,
        "messages": [m for _, m in results],
        "player": player.serialize(),
        "activity": activity.serialize(),
        # Contract completions / achievements earned by this very action -
        # included so they toast immediately instead of arriving as
        # "historical" entries on the next activity poll.
        "extra_activities": [e.serialize() for e in goal_entries],
    }), 200


@game_api.route('/mission/outfit', methods=['POST'])
@jwt_required()
def mission_outfit():
    """
    Buy everything a mission still needs in one transaction: missing
    required equipment at store pricing (merchant + ally discounts apply,
    same math as equipment_buy) and missing supplies at the live market
    buy price (same math as market_buy, cost-basis bookkeeping included).
    All-or-nothing: the whole list is priced and checked against credits
    and storage before anything is bought, so a partial outfit - the
    exact one-item-at-a-time round trip this replaces - can't happen.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    mission_name = data.get("mission_name")
    mission = (game_data.MISSIONS.get(mission_name)
               or game_data.STORY_MISSIONS.get(mission_name))
    if not mission:
        return jsonify({"message": "unknown mission"}), 404

    rep_off = economy.rep_discount(player)
    purchases = []  # (kind, item_name, shortfall, total_cost)

    equipment_needed = 0
    for item_name, required_qty in (mission.get("requiredEquipment") or {}).items():
        shortfall = required_qty - _equipment_qty(player, item_name)
        if shortfall <= 0:
            continue
        category, equipment_data = economy.find_equipment(item_name)
        if not equipment_data:
            return jsonify({"message": f"{item_name} is not purchasable"}), 400
        if player.level < equipment_data["Required Level"]:
            return jsonify({
                "message": f"your level is too low for {item_name}"
            }), 403
        unit_cost = equipment_data["Base Cost"]
        merchant_factor = economy.get_merchant_price_factor(category)
        if merchant_factor < 1:
            unit_cost = max(1, round(unit_cost * merchant_factor))
        if rep_off > 0:
            unit_cost = max(1, round(unit_cost * (1 - rep_off)))
        purchases.append(("equipment", item_name, shortfall, unit_cost * shortfall))
        equipment_needed += shortfall

    inventory_now = player.inventory or {}
    for item_name, required_qty in (mission.get("requiredSupplies") or {}).items():
        held = math.floor(inventory_now.get(item_name, {}).get("quantity", 0))
        shortfall = required_qty - held
        if shortfall <= 0:
            continue
        _, catalog_item = economy.find_catalog_item(item_name)
        price_row = economy.get_item_price(item_name)
        if not catalog_item or not price_row:
            return jsonify({"message": f"{item_name} is not on the market"}), 400
        if catalog_item["Rank"] > player.level:
            return jsonify({
                "message": f"your level is too low for {item_name}"
            }), 403
        raw_qty = inventory_now.get(item_name, {}).get("quantity", 0)
        if raw_qty + shortfall > player.maxInventoryCount:
            return jsonify({
                "message": f"not enough inventory space for {shortfall}x {item_name}"
            }), 400
        purchases.append((
            "supply", item_name, shortfall,
            int(economy.get_buy_price(price_row) * shortfall),
        ))

    if not purchases:
        return jsonify({
            "message": "Nothing missing - you're already outfitted for this mission."
        }), 400

    held_total = _equipment_total(player)
    capacity = player.maxEquipmentCount or 0
    if held_total + equipment_needed > capacity:
        return jsonify({
            "message": (
                f"not enough equipment storage ({held_total}/{capacity} used, "
                f"{equipment_needed} more slots needed)"
            )
        }), 400

    grand_total = sum(total for _, _, _, total in purchases)
    if player.credits < grand_total:
        return jsonify({
            "message": (
                f"Outfitting costs {grand_total:,} credits - "
                f"you have {player.credits:,}."
            )
        }), 400

    player.credits -= grand_total
    equipment = dict(player.equipment or {})
    inventory = dict(player.inventory or {})
    parts = []
    for kind, item_name, qty, total in purchases:
        if kind == "equipment":
            current = equipment.get(item_name, {}).get("quantity", 0)
            equipment[item_name] = {"quantity": current + qty}
        else:
            entry = inventory.get(item_name, {})
            current_qty = entry.get("quantity", 0)
            current_avg = entry.get("avg_cost", 0)
            new_qty = current_qty + qty
            new_avg = round(((current_avg * current_qty) + total) / new_qty, 2)
            inventory[item_name] = {"quantity": new_qty, "avg_cost": new_avg}
        parts.append(f"{qty}x {item_name} ({total:,})")
    player.equipment = equipment
    player.inventory = inventory

    activity = economy.log_activity(
        player,
        f"🧰 Outfitted for {mission_name}: {', '.join(parts)} - "
        f"{grand_total:,} credits total.",
        "buy",
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": grand_total,
        "activity": activity.serialize(),
    }), 200


def _warband_or_400(player, data):
    """Common validation for the warband endpoints."""
    faction = (data or {}).get("faction")
    if faction not in game_data.WARBANDS:
        return None, (jsonify({"message": "unknown warband"}), 404)
    if not economy.warband_unlocked(player, faction):
        cfg = game_data.WARBANDS[faction]
        return None, (jsonify({
            "message": (
                f"The {cfg['name']} haven't joined the war yet - their "
                f"trust is won at {cfg['unlock_wins']} story wins."
            )
        }), 403)
    return faction, None


@game_api.route('/warband/fund', methods=['POST'])
@jwt_required()
def warband_fund():
    """
    Fund volunteers for an allied warband. Strength is PERMANENT - it
    never decays and is never lost - which is what makes it safe to gate
    content on. Per-volunteer cost escalates with company size.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    faction, err = _warband_or_400(player, data)
    if err:
        return err
    volunteers = data.get("volunteers")
    if not isinstance(volunteers, int) or volunteers <= 0:
        return jsonify({"message": "volunteers must be a positive integer"}), 400

    state = economy.warband_state(player, faction)
    if state["strength"] + volunteers > economy.WARBAND_MAX_STRENGTH:
        return jsonify({
            "message": f"a warband caps at {economy.WARBAND_MAX_STRENGTH} strength"
        }), 400

    total_cost = sum(
        economy.warband_volunteer_cost(faction, state["strength"] + i)
        for i in range(volunteers)
    )
    if player.credits < total_cost:
        return jsonify({
            "message": f"funding {volunteers} volunteers costs {total_cost:,} credits"
        }), 400

    player.credits -= total_cost
    warbands = dict(player.warbands or {})
    state["strength"] += volunteers
    warbands[faction] = state
    player.warbands = warbands

    cfg = game_data.WARBANDS[faction]
    activity = economy.log_activity(
        player,
        f"⚔️ {volunteers} volunteers join the {cfg['name']} "
        f"({total_cost:,} credits) - strength {state['strength']}.",
        "warband",
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": total_cost,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/warband/kit', methods=['POST'])
@jwt_required()
def warband_kit():
    """Buy gear kits (one outfits 10 volunteers). Kits are permanent too."""
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    faction, err = _warband_or_400(player, data)
    if err:
        return err
    kits = data.get("kits")
    if not isinstance(kits, int) or kits <= 0:
        return jsonify({"message": "kits must be a positive integer"}), 400

    state = economy.warband_state(player, faction)
    kits_needed = max(1, math.ceil(
        max(1, state["strength"]) / economy.WARBAND_KIT_SIZE))
    if state["kits"] + kits > kits_needed:
        return jsonify({
            "message": (
                f"the {game_data.WARBANDS[faction]['name']} only need "
                f"{kits_needed} kits at their current strength"
            )
        }), 400

    total_cost = economy.warband_kit_cost(faction) * kits
    if player.credits < total_cost:
        return jsonify({
            "message": f"{kits} gear kits cost {total_cost:,} credits"
        }), 400

    player.credits -= total_cost
    warbands = dict(player.warbands or {})
    state["kits"] += kits
    warbands[faction] = state
    player.warbands = warbands

    activity = economy.log_activity(
        player,
        f"🛡 {kits} gear kits delivered to the "
        f"{game_data.WARBANDS[faction]['name']} ({total_cost:,} credits).",
        "warband",
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": total_cost,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/warband/provision', methods=['POST'])
@jwt_required()
def warband_provision():
    """
    Stock a warband's provisions: real market goods at the LIVE buy
    price (the recurring market sink). Capped at 72 hours of supply so
    provisioning stays upkeep, not a one-time vault fill.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    faction, err = _warband_or_400(player, data)
    if err:
        return err
    units = data.get("units")
    if not isinstance(units, int) or units <= 0:
        return jsonify({"message": "units must be a positive integer"}), 400

    state = economy.warband_state(player, faction)
    if state["strength"] <= 0:
        return jsonify({"message": "fund some volunteers first"}), 400
    drain = economy.warband_provision_drain_per_hour(state["strength"])
    cap = drain * economy.WARBAND_PROVISION_CAP_HOURS
    if state["provisions"] + units > cap:
        return jsonify({
            "message": (
                f"provision stores cap at {cap:.0f} units "
                f"({economy.WARBAND_PROVISION_CAP_HOURS}h of supply)"
            )
        }), 400

    item_name = game_data.WARBANDS[faction]["provision_item"]
    price_row = economy.get_item_price(item_name)
    if not price_row:
        return jsonify({"message": f"{item_name} is not on the market"}), 400
    total_cost = int(economy.get_buy_price(price_row) * units)
    if player.credits < total_cost:
        return jsonify({
            "message": f"{units}x {item_name} costs {total_cost:,} credits"
        }), 400

    player.credits -= total_cost
    warbands = dict(player.warbands or {})
    state["provisions"] = round(state["provisions"] + units, 3)
    warbands[faction] = state
    player.warbands = warbands

    activity = economy.log_activity(
        player,
        f"🍞 {units}x {item_name} provisioned to the "
        f"{game_data.WARBANDS[faction]['name']} ({total_cost:,} credits) - "
        f"{state['provisions'] / drain:.0f}h of supply.",
        "warband",
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "total_cost": total_cost,
        "activity": activity.serialize(),
    }), 200


@game_api.route('/warband/assign', methods=['POST'])
@jwt_required()
def warband_assign():
    """
    Set (or clear, with assignment: null) a warband's standing operation.
    A deployed warband burns provisions at double rate and accrues its
    yield only while provisioned - assigning a dry warband is allowed,
    it just stalls until fed.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    faction, err = _warband_or_400(player, data)
    if err:
        return err
    assignment = data.get("assignment")
    if assignment is not None and assignment not in economy.WARBAND_OP_KINDS:
        return jsonify({
            "message": f"assignment must be one of {economy.WARBAND_OP_KINDS} or null"
        }), 400

    state = economy.warband_state(player, faction)
    if assignment and state["strength"] <= 0:
        return jsonify({"message": "recruit some volunteers first"}), 400
    if (assignment == "banners"
            and state["strength"] < economy.WARBAND_BANNER_MIN_STRENGTH):
        return jsonify({
            "message": (
                f"showing the banners takes at least "
                f"{economy.WARBAND_BANNER_MIN_STRENGTH} strength"
            )
        }), 400

    warbands = dict(player.warbands or {})
    stored = dict(warbands.get(faction) or {})
    stored.update(state)
    stored["assignment"] = assignment
    warbands[faction] = stored
    player.warbands = warbands

    cfg = game_data.WARBANDS[faction]
    labels = {"patrol": "patrolling their land (credits)",
              "salvage": "running salvage sweeps (goods)",
              "banners": "showing the banners (reputation)",
              None: "standing down"}
    activity = economy.log_activity(
        player, f"🎯 The {cfg['name']} are now {labels[assignment]}.",
        "warband",
    )
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "activity": activity.serialize(),
    }), 200


@game_api.route('/warband/collect', methods=['POST'])
@jwt_required()
def warband_collect():
    """
    Claim a warband's operation stash: whole credits, whole items (into
    inventory, clipped to space - the remainder stays banked), whole rep
    points. One quartermaster report per claim.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    faction, err = _warband_or_400(player, data)
    if err:
        return err

    state = economy.warband_state(player, faction)
    warbands = dict(player.warbands or {})
    stored = dict(warbands.get(faction) or {})
    stash = dict(stored.get("stash") or {"credits": 0.0, "items": 0.0, "rep": 0.0})
    cfg = game_data.WARBANDS[faction]

    credits = int(stash.get("credits", 0.0))
    items = int(stash.get("items", 0.0))
    rep = int(stash.get("rep", 0.0))
    parts = []

    if credits > 0:
        player.credits += credits
        stash["credits"] = round(stash["credits"] - credits, 3)
        parts.append(f"+{credits:,} credits")
    if items > 0:
        item_name = cfg["salvage_item"]
        inventory = dict(player.inventory or {})
        entry = inventory.get(item_name, {})
        held = entry.get("quantity", 0)
        space = max(0, (player.maxInventoryCount or 0) - math.floor(held))
        take = min(items, space)
        if take > 0:
            # Salvage has no cost basis - it's found, not bought.
            new_qty = held + take
            new_avg = round(
                (entry.get("avg_cost", 0) * held) / new_qty, 2) if new_qty else 0
            inventory[item_name] = {"quantity": new_qty, "avg_cost": new_avg}
            player.inventory = inventory
            stash["items"] = round(stash["items"] - take, 3)
            parts.append(f"+{take}x {item_name}")
            if take < items:
                parts.append(f"({items - take}x held back - hold full)")
        else:
            parts.append(f"({items}x {item_name} held back - hold full)")
    if rep > 0:
        reputation = dict(player.reputation or {})
        reputation[faction] = reputation.get(faction, 0) + rep
        player.reputation = reputation
        stash["rep"] = round(stash["rep"] - rep, 3)
        parts.append(f"+{rep} {faction} reputation")

    if not parts:
        return jsonify({
            "message": "Nothing to collect yet - give the operation time."
        }), 400

    stored.update(state)
    stored["stash"] = stash
    warbands[faction] = stored
    player.warbands = warbands

    activity = economy.log_activity(
        player,
        f"📦 Quartermaster's report - {cfg['name']}: {', '.join(parts)}.",
        "warband",
    )
    goal_entries = economy.check_achievements(player)
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
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

    success, message, goal_entries = economy.resolve_mission(
        player, mission, is_story=True
    )

    if success:
        player.storyWins += 1
        # Every story win earns +1 reputation with the mission's faction
        # (all six tribes for the United Front finale arc).
        goal_entries.extend(economy.grant_story_reputation(player, mission))
        # storyWins moved after resolve_mission's own bump_stats ran, so
        # re-check achievements for story-win thresholds crossed just now.
        goal_entries.extend(economy.check_achievements(player))

    activity = economy.log_activity(
        player, message, "mission-success" if success else "mission-fail"
    )

    db.session.commit()
    return jsonify({
        "success": success,
        "message": message,
        "player": player.serialize(),
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
    }), 200


@game_api.route('/story/choice', methods=['POST'])
@jwt_required()
def story_choice():
    """
    Resolve the player's currently pending chapter-end choice. The catalog
    (game_data.STORY_CHOICES) is server-side; the client only ever sends
    the ids, and only the choice that is actually pending can be resolved -
    no skipping ahead, no re-answering.
    """
    player, err = _player_or_404()
    if err:
        return err
    economy.apply_passive_tick(player)

    data = request.get_json(silent=True) or {}
    choice_id = data.get("choice_id")
    option_id = data.get("option_id")

    pending = player.pending_story_choice()
    if not pending or pending["id"] != choice_id:
        return jsonify({"message": "that choice is not pending"}), 400
    option = next((o for o in pending["options"] if o["id"] == option_id), None)
    if not option:
        return jsonify({"message": "unknown option"}), 400

    # Record first (copy-reassign), then grant the reward.
    resolved = dict(player.story_choices or {})
    resolved[choice_id] = option_id
    player.story_choices = resolved

    reward = option.get("reward") or {}
    reward_notes = []
    if reward.get("credits"):
        player.credits += reward["credits"]
        reward_notes.append(f"+{reward['credits']} credits")
    if reward.get("rep"):
        reputation = dict(player.reputation or {})
        for faction, points in reward["rep"].items():
            reputation[faction] = reputation.get(faction, 0) + points
            reward_notes.append(f"+{points} {faction} reputation")
        player.reputation = reputation
    if reward.get("rep_all"):
        reputation = dict(player.reputation or {})
        for faction in game_data.FACTIONS:
            reputation[faction] = reputation.get(faction, 0) + reward["rep_all"]
        player.reputation = reputation
        reward_notes.append(f"+{reward['rep_all']} reputation with all tribes")
    if reward.get("equipment"):
        equipment = dict(player.equipment or {})
        for item_name, qty in reward["equipment"].items():
            held = equipment.get(item_name, {}).get("quantity", 0)
            equipment[item_name] = {"quantity": held + qty}
            reward_notes.append(f"+{qty}x {item_name}")
        player.equipment = equipment

    note = f" ({', '.join(reward_notes)}.)" if reward_notes else ""
    activity = economy.log_activity(
        player, f"📖 {option['outcome_text']}{note}", "choice"
    )
    goal_entries = economy.check_achievements(player)
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
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

    # Each use today raises the next price in this category (resets on the
    # UTC date). Faction allies still get their discount on top.
    uses = economy.recovery_uses_today(player)
    cost = economy.recovery_price(player, category, item_data)
    rep_off = economy.rep_discount(player)
    if rep_off > 0:
        cost = max(1, round(cost * (1 - rep_off)))
    if player.credits < cost:
        return jsonify({"message": "insufficient credits"}), 400

    health_gain = min(item_data["Health Gain"], player.maxHealth - player.health)
    energy_gain = min(item_data["Energy Gain"], player.maxEnergy - player.energy)

    player.credits -= cost
    player.health += health_gain
    player.energy += energy_gain
    cooldowns[item_name] = now.isoformat()
    player.item_cooldowns = cooldowns
    uses[category] = uses.get(category, 0) + 1
    player.recovery_uses = uses

    rep_note = f" (ally discount: {round(rep_off * 100)}% off)" if rep_off > 0 else ""
    activity = economy.log_activity(
        player,
        f"Used {item_name} for {cost} credits: +{health_gain} health, "
        f"+{energy_gain} energy.{rep_note}",
        "recovery",
    )
    goal_entries = economy.bump_stats(player, recovery_items_used=1)
    db.session.commit()
    return jsonify({
        "player": player.serialize(),
        "health_gained": health_gain,
        "energy_gained": energy_gain,
        "activity": activity.serialize(),
        "extra_activities": [e.serialize() for e in goal_entries],
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

    activity = economy.log_activity(
        player,
        f"Expanded {STAT_DISPLAY_NAMES.get(stat, stat)} to "
        f"{current_value + UPGRADE_STAT_STEP} for {cost} credits.",
        "upgrade",
    )
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
    # Carry pool belongs with the inventory/properties it was produced by.
    player.production_remainders = {}
    player.pending_production = {}
    player.maxInventoryCount = 10
    player.maxHealth = 100
    player.maxEnergy = 100
    player.maxEquipmentCount = 20
    player.storyWins = 0
    player.win_streak = 0
    player.item_cooldowns = {}
    player.recovery_uses = {}
    player.rested_energy = 0
    player.upgrade_steps = {}
    player.ship = {}
    # A full reset wipes meta-progression too - unlike prestige, which
    # deliberately keeps stats/achievements (they're the meta-progression
    # axis a rebirth is supposed to preserve).
    player.stats = {}
    player.daily_contracts = {}
    player.achievements = []
    # Story progress axes reset with the full wipe (prestige, by contrast,
    # keeps storyWins - and with it reputation and resolved choices).
    player.reputation = {}
    player.story_choices = {}
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
    player.production_remainders = {}
    player.pending_production = {}
    player.maxInventoryCount = 10 + player.prestige_level * economy.PRESTIGE_MAX_INVENTORY_BONUS
    player.maxHealth = 100 + player.prestige_level * economy.PRESTIGE_MAX_HEALTH_BONUS
    player.maxEnergy = 100 + player.prestige_level * economy.PRESTIGE_MAX_ENERGY_BONUS
    player.maxEquipmentCount = 20 + player.prestige_level * economy.PRESTIGE_MAX_EQUIPMENT_BONUS
    player.health = player.maxHealth
    player.energy = player.maxEnergy
    player.win_streak = 0
    player.item_cooldowns = {}
    player.recovery_uses = {}
    player.rested_energy = 0
    # Purchased-upgrade counters reset with the run. Keeping them would
    # mean every post-prestige upgrade started at the old escalated price -
    # the same anti-synergy that keying cost off the raw stat value caused.
    player.upgrade_steps = {}
    # The ship SURVIVES a rebirth, deliberately. Modules cost millions -
    # far more than one run earns - so wiping them would make the whole
    # system unreachable, and a faster ship on the next run is exactly the
    # sort of permanent gain prestige is meant to hand out.
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
        f"Prestiged to level {player.prestige_level}! Stats reset, but your "
        "stat floors are permanently higher and every mission now pays "
        f"+{round(economy.prestige_bonus(player) * 100)}% credits and XP.",
        "prestige",
    )
    db.session.commit()
    return jsonify({"player": player.serialize(), "activity": activity.serialize()}), 200
