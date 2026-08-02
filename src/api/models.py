from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def utcnow():
    # Naive UTC on purpose: SQLite (used in dev) silently drops tzinfo on
    # round-trip even for DateTime(timezone=True) columns, which would
    # otherwise cause "can't subtract offset-naive and offset-aware
    # datetimes" once a value is read back from the DB. Keeping everything
    # naive-but-always-UTC avoids that class of bug across both SQLite and
    # Postgres.
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    username = db.Column(db.String(100), unique=False, nullable=True)
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "is_active": self.is_active
            # do not serialize the password, its a security breach
        }

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), default='Jahntow')
    level = db.Column(db.Integer, default=1)
    experience = db.Column(db.Integer, default=0)
    health = db.Column(db.Integer, default=100)
    energy = db.Column(db.Integer, default=100)
    credits = db.Column(db.Integer, default=5000)
    equipment = db.Column(db.JSON, default=dict)
    inventory = db.Column(db.JSON, default=dict)
    properties = db.Column(db.JSON, default=dict)
    maxInventoryCount = db.Column(db.Integer, default=10)
    maxHealth = db.Column(db.Integer, default=100)
    maxEnergy = db.Column(db.Integer, default=100)
    storyWins = db.Column(db.Integer, default=0)

    # Per-item cooldown tracking for Medlab recovery items, e.g.
    # {"HealPulse Emitter": "2026-08-02T12:34:56"} (naive UTC ISO string).
    # Enforced
    # server-side now instead of trusting client React state (which reset
    # on every page refresh).
    item_cooldowns = db.Column(db.JSON, default=dict)

    # Last time passive effects (energy regen, property item generation)
    # were applied to this player. Passive gains are computed lazily from
    # elapsed wall-clock time whenever the player is loaded/acted on,
    # rather than relying on a client-side setInterval that only ran while
    # a particular tab/component was open.
    last_tick_at = db.Column(db.DateTime(), default=utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # linking the player to a user

    User.player = db.relationship("Player", uselist=False, back_populates="user")

    # Relationship to link a User to a Player
    user = db.relationship("User", back_populates="player")

    def __repr__(self):
        return f'<Player {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "level": self.level,
            "experience": self.experience,
            "health": self.health,
            "energy": self.energy,
            "credits": self.credits,
            "equipment": self.equipment,
            "inventory": self.inventory,
            "properties": self.properties,
            "maxInventoryCount": self.maxInventoryCount,
            "maxHealth": self.maxHealth,
            "maxEnergy": self.maxEnergy,
            "storyWins": self.storyWins,
        }


class MarketPrice(db.Model):
    """
    Single shared price per item, the same for every player. Replaces the
    old per-player Player.item_prices JSON blob, which let every browser
    tab independently randomize and persist its own divergent prices.
    """
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(80), unique=True, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    base_cost = db.Column(db.Float, nullable=False)
    current_cost = db.Column(db.Float, nullable=False)
    updated_at = db.Column(db.DateTime(), default=utcnow, onupdate=utcnow)

    def serialize(self):
        return {
            "item_name": self.item_name,
            "category": self.category,
            "base_cost": self.base_cost,
            "current_cost": self.current_cost,
        }
