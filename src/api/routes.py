"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Player
from api.utils import generate_sitemap, APIException

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from argon2 import PasswordHasher


ph = PasswordHasher()

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def register():
    content = request.get_json(silent=True)
    user = User(email=content["email"], password=ph.hash(content["password"]), is_active=True)

    # Add the new user to the session
    db.session.add(user)
    db.session.flush()  # This flushes the changes and generates the user's ID

    # Create a default player for the new user
    player = Player(name=content.get("username", "DefaultName"), user_id=user.id)
    db.session.add(player)
    
    db.session.commit()

    response_body = {
        "message": "User and default player created"
    }

    return jsonify(response_body), 204


@api.route('/login', methods=['POST'])
def login():

    content = request.get_json()
    print(content)
    user = User.query.filter(User.email == content["email"]).first()
    if user is None:
        return jsonify({"message": "invalid user"}), 403
    
    try:
        ph.verify(user.password, content["password"])
    except:
        return jsonify({"message": "invalid password"}), 403
        
    access_token = create_access_token(identity=user.id, additional_claims={"email":user.email})
    return jsonify({ "token": access_token, "user_id": user.id })


@api.route('/userinfo', methods=['GET'])
@jwt_required()
def userinfo():
    current_user_id = get_jwt_identity()
    
    user = User.query.filter(User.id == current_user_id).first()
    
    response_body = {
        "message": f"Hello {user.email} "
    }

    return jsonify(response_body), 200

@api.route('/player', methods=['GET'])
@jwt_required()
def get_player_info():
    current_user_id = get_jwt_identity()

    player = Player.query.filter(Player.user_id == current_user_id).first()

    if not player:
        return jsonify({"message": "Player not found"}), 404

    return jsonify(player.serialize()), 200

@api.route('/player', methods=['PUT'])
@jwt_required()
def update_player_info():
    current_user_id = get_jwt_identity()

    player = Player.query.filter(Player.user_id == current_user_id).first()

    if not player:
        return jsonify({"message": "Player not found"}), 404

    data = request.get_json()
    
    # Update player's fields. Assuming `data` has keys corresponding to Player's fields.
    for key, value in data.items():
        if hasattr(player, key):
            setattr(player, key, value)

    db.session.commit()

    return jsonify(player.serialize()), 200


