from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
    credits = db.Column(db.Integer, default=1000)
    equipment = db.Column(db.JSON, default=dict)
    inventory = db.Column(db.JSON, default=dict)
    properties = db.Column(db.JSON, default=dict)
    maxInventoryCount = db.Column(db.Integer, default=10)
    maxHealth = db.Column(db.Integer, default=100)
    maxEnergy = db.Column(db.Integer, default=100)
    storyWins = db.Column(db.Integer, default=0)
    item_prices = db.Column(db.JSON, default=dict)
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
            "item_prices": self.item_prices
        }

