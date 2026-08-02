"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import re
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Player
from api.utils import generate_sitemap, APIException

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from argon2 import PasswordHasher
from sqlalchemy.exc import IntegrityError

from api.extensions import limiter
from api import economy

ph = PasswordHasher()

api = Blueprint('api', __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Fields a player is allowed to change directly through PUT /player.
# Anything that affects game state (credits, inventory, level, experience,
# health, energy, equipment, prices, etc.) must go through a dedicated,
# server-computed endpoint instead of being writable from the client.
PLAYER_SELF_EDITABLE_FIELDS = {"name"}


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
@limiter.limit("10 per hour")
def register():
    content = request.get_json(silent=True) or {}
    email = (content.get("email") or "").strip().lower()
    password = content.get("password") or ""

    if not EMAIL_RE.match(email):
        return jsonify({"message": "a valid email is required"}), 400
    if len(password) < 8:
        return jsonify({"message": "password must be at least 8 characters"}), 400

    if User.query.filter(User.email == email).first() is not None:
        return jsonify({"message": "an account with that email already exists"}), 409

    user = User(email=email, password=ph.hash(password), is_active=True)

    # Add the new user to the session
    db.session.add(user)
    db.session.flush()  # This flushes the changes and generates the user's ID

    # Create a default player for the new user
    username = (content.get("username") or "Jahntow").strip()[:80] or "Jahntow"
    player = Player(name=username, user_id=user.id)
    db.session.add(player)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "an account with that email already exists"}), 409

    access_token = create_access_token(identity=str(user.id), additional_claims={"email": user.email})

    response_body = {
        "message": "User and default player created",
        "token": access_token
    }

    return jsonify(response_body), 201



@api.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():

    content = request.get_json(silent=True) or {}
    email = (content.get("email") or "").strip().lower()
    password = content.get("password") or ""

    user = User.query.filter(User.email == email).first()
    if user is None:
        return jsonify({"message": "invalid email or password"}), 403

    try:
        ph.verify(user.password, password)
    except Exception:
        return jsonify({"message": "invalid email or password"}), 403

    access_token = create_access_token(identity=str(user.id), additional_claims={"email": user.email})
    return jsonify({"token": access_token, "user_id": user.id})


@api.route('/userinfo', methods=['GET'])
@jwt_required()
def userinfo():
    current_user_id = int(get_jwt_identity())
    
    user = User.query.filter(User.id == current_user_id).first()
    
    response_body = {
        "message": f"Hello {user.email} "
    }

    return jsonify(response_body), 200

@api.route('/player', methods=['GET'])
@jwt_required()
def get_player_info():
    current_user_id = int(get_jwt_identity())

    player = Player.query.filter(Player.user_id == current_user_id).first()

    if not player:
        return jsonify({"message": "Player not found"}), 404

    economy.apply_passive_tick(player)
    db.session.commit()

    return jsonify(player.serialize()), 200

@api.route('/player', methods=['PUT'])
@jwt_required()
def update_player_info():
    """
    Only cosmetic, non-authoritative fields may be edited directly by the
    client. Game state (credits, inventory, equipment, level, experience,
    health, energy, item_prices, etc.) must never be settable from client
    input here -- previously this endpoint accepted any field name via
    setattr(), letting a client set their own credits/prices directly.
    That state now moves to dedicated server-computed endpoints
    (market/mission/upgrade actions) as part of the ongoing backend
    migration; until those land, those fields are read-only via this route.
    """
    current_user_id = int(get_jwt_identity())

    player = Player.query.filter(Player.user_id == current_user_id).first()

    if not player:
        return jsonify({"message": "Player not found"}), 404

    data = request.get_json(silent=True) or {}

    rejected = sorted(set(data.keys()) - PLAYER_SELF_EDITABLE_FIELDS)

    if "name" in data:
        name = (data["name"] or "").strip()[:80]
        if name:
            player.name = name

    db.session.commit()

    response_body = player.serialize()
    if rejected:
        response_body["_rejected_fields"] = rejected
    return jsonify(response_body), 200



