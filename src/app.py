"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from datetime import timedelta
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.extensions import limiter
from api.utils import APIException, generate_sitemap
from api.models import db, User, Player
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import JWTManager


ENV = os.getenv("FLASK_ENV", "production")
IS_DEVELOPMENT = ENV == "development"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False


jwt_secret = os.getenv("JWT_SECRET_KEY")
if not jwt_secret:
    if IS_DEVELOPMENT:
        jwt_secret = "dev-only-insecure-secret-do-not-use-in-production"
    else:
        raise RuntimeError(
            "JWT_SECRET_KEY environment variable must be set in production. "
            "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
        )
app.config["JWT_SECRET_KEY"] = jwt_secret
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)
jwt = JWTManager(app)

# Rate limiting to slow down brute-force login/register attempts
limiter.init_app(app)


# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests only from configured origins (comma-separated CORS_ORIGINS env var)
cors_origins = os.getenv("CORS_ORIGINS")
if cors_origins:
    CORS(app, origins=[o.strip() for o in cors_origins.split(",") if o.strip()])
elif IS_DEVELOPMENT:
    CORS(app)
else:
    # No origins configured: same-origin only (frontend is served by this same Flask app)
    CORS(app, origins=[])

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')








# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=IS_DEVELOPMENT)
