from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy

from api import game_data

db = SQLAlchemy()

# XP needed to reach the next level = level * XP_PER_LEVEL. Lives here
# rather than in economy.py so Player.serialize() can report the threshold
# to the client without importing economy (which imports models).
XP_PER_LEVEL = 100


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
    # Total equipment units the player can hold across all equipment types
    # (a shared "locker"), upgradable like the other maxima. Previously
    # equipment was the only uncapped resource in the game.
    maxEquipmentCount = db.Column(db.Integer, default=20)
    storyWins = db.Column(db.Integer, default=0)

    # How many upgrade steps have been purchased per stat. Upgrade cost
    # keys off this rather than the raw stat value, so stats that start at
    # different bases (inventory 10 vs health/energy 100) price
    # comparably - and so prestige raising a stat's floor doesn't
    # retroactively make the next upgrade more expensive.
    upgrade_steps = db.Column(db.JSON, default=dict)

    # Per-item cooldown tracking for Medlab recovery items, e.g.
    # {"HealPulse Emitter": "2026-08-02T12:34:56"} (naive UTC ISO string).
    # Enforced
    # server-side now instead of trusting client React state (which reset
    # on every page refresh).
    item_cooldowns = db.Column(db.JSON, default=dict)

    # Last time passive effects were applied to this player. Passive gains
    # are computed lazily from elapsed wall-clock time whenever the player
    # is loaded/acted on, rather than relying on a client-side setInterval
    # that only ran while a particular tab/component was open.
    last_tick_at = db.Column(db.DateTime(), default=utcnow)

    # Each passive resource ticks on its own interval (energy 10s,
    # production 30s, credit trickle 144s), so each needs its own
    # last-applied timestamp. Sharing one clock meant the shortest
    # interval's remainder reset the others: with the frontend polling
    # every 20s, int(20s / 30s) == 0 production ticks, the leftover 20s was
    # discarded, and properties produced *nothing at all* while a tab was
    # open. These advance by exactly the time consumed, so sub-tick
    # remainders carry forward. Nullable so existing rows fall back to
    # last_tick_at on first use rather than needing a data migration.
    last_energy_tick_at = db.Column(db.DateTime(), nullable=True)
    last_health_tick_at = db.Column(db.DateTime(), nullable=True)
    last_production_tick_at = db.Column(db.DateTime(), nullable=True)
    last_trickle_at = db.Column(db.DateTime(), nullable=True)

    # Daily login streak. last_login_at is compared by UTC calendar date
    # (not a rolling 24h window) each time GET /player runs, so it's
    # updated on both an explicit next-day login and a tab left open
    # across midnight.
    last_login_at = db.Column(db.DateTime(), nullable=True)
    login_streak = db.Column(db.Integer, default=0)

    # Consecutive successful (non-Guaranteed) mission wins. Feeds a small
    # credit-reward bonus per win (see economy.WIN_STREAK_*) and resets to
    # zero on any mission failure.
    win_streak = db.Column(db.Integer, default=0)

    # Lifetime counters (missions_won, missions_failed, items_sold,
    # credits_earned, best_win_streak) maintained by economy.bump_stats.
    # They feed daily-contract progress and achievement thresholds, and
    # deliberately survive prestige - they're meta-progression.
    stats = db.Column(db.JSON, default=dict)

    # Today's contracts: {"date": "YYYY-MM-DD", "contracts": [...]}.
    # Regenerated lazily by economy.ensure_daily_contracts the first time
    # the player is seen on a new UTC day - same request-driven pattern as
    # the login streak, no scheduler.
    daily_contracts = db.Column(db.JSON, default=dict)

    # Earned achievement ids, in the order they were earned (which is what
    # makes "newest title" well-defined). Catalog in game_data.ACHIEVEMENTS.
    achievements = db.Column(db.JSON, default=list)

    # Faction reputation, {faction_name: points}. +1 with a mission's
    # faction per story win (+1 with all six on United Front finale
    # missions). Tiers unlock discounts and story success bonuses - see
    # economy.REP_* constants. Like storyWins, survives prestige.
    reputation = db.Column(db.JSON, default=dict)

    # Resolved chapter-end choices, {choice_id: option_id}. The catalog
    # lives in game_data.STORY_CHOICES; pending_story_choice() computes
    # which one (if any) is currently awaiting a decision.
    story_choices = db.Column(db.JSON, default=dict)

    # Number of times this player has rebirthed at max level. Each prestige
    # permanently raises the maxHealth/maxEnergy/maxInventoryCount floor
    # (see economy.PRESTIGE_MAX_*_BONUS) in exchange for resetting level,
    # credits, and inventory/equipment/properties back to the base start.
    prestige_level = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # linking the player to a user

    User.player = db.relationship("Player", uselist=False, back_populates="user")

    # Relationship to link a User to a Player
    user = db.relationship("User", back_populates="player")

    def __repr__(self):
        return f'<Player {self.name}>'

    def current_title(self):
        """
        The most recently earned achievement title (or None). Earn order is
        the order of the achievements list, so a newly earned title
        replaces an older one rather than the catalog deciding.
        """
        by_id = {a["id"]: a for a in game_data.ACHIEVEMENTS}
        title = None
        for ach_id in (self.achievements or []):
            ach = by_id.get(ach_id)
            if ach and ach.get("title"):
                title = ach["title"]
        return title

    def pending_story_choice(self):
        """
        The earliest chapter-end choice whose after_wins threshold has been
        crossed but which hasn't been resolved yet (or None). One at a
        time, in story order - a player who blasts past several thresholds
        answers them oldest-first.
        """
        resolved = self.story_choices or {}
        for choice in game_data.STORY_CHOICES:
            if (self.storyWins or 0) >= choice["after_wins"] and choice["id"] not in resolved:
                return choice
        return None

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
            "maxEquipmentCount": self.maxEquipmentCount,
            "storyWins": self.storyWins,
            "loginStreak": self.login_streak,
            "winStreak": self.win_streak or 0,
            "prestigeLevel": self.prestige_level,
            # The level-up threshold lives server-side; without sending it
            # the client literally cannot show progress toward the next level.
            "xpForNextLevel": self.level * XP_PER_LEVEL,
            # Needed to render Medlab cooldown countdowns instead of only
            # surfacing a 429 error after the player clicks.
            "itemCooldowns": self.item_cooldowns or {},
            "upgradeSteps": self.upgrade_steps or {},
            "stats": self.stats or {},
            "dailyContracts": self.daily_contracts or {},
            "achievements": self.achievements or [],
            "title": self.current_title(),
            "reputation": self.reputation or {},
            "storyChoices": self.story_choices or {},
            "pendingChoice": self.pending_story_choice(),
        }

    def serialize_public(self):
        """
        For the leaderboard - other players never see inventory, equipment,
        or properties. Only the fields meaningful to compare/rank on.
        """
        return {
            "name": self.name,
            "level": self.level,
            "credits": self.credits,
            "storyWins": self.storyWins,
            "prestigeLevel": self.prestige_level,
            # Achievement titles are earned flair - exactly the kind of
            # thing a leaderboard exists to show off.
            "title": self.current_title(),
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

    # Baseline current_cost was at the last time a "price changed" global
    # notification was posted for this item - the server-side equivalent
    # of what used to be a client-only, page-load-reset baseline dict.
    # Falls back to base_cost the first time a row is checked.
    last_notified_cost = db.Column(db.Float, nullable=True)

    def serialize(self):
        return {
            "item_name": self.item_name,
            "category": self.category,
            "base_cost": self.base_cost,
            "current_cost": self.current_cost,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class MarketPriceHistory(db.Model):
    """
    Rolling price series per item, appended by the same tick that advances
    current_cost - so it needs no separate mechanism. Trimmed on write to
    the most recent economy.PRICE_HISTORY_POINTS per item, which bounds
    the table without a background job.
    """
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(80), nullable=False, index=True)
    cost = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime(), default=utcnow)


class GameEvent(db.Model):
    """
    A temporary, global price-spike or price-crash on one item category -
    shared across every player, same as MarketPrice. The multiplier is
    applied at read/transaction time (see economy.get_event_multiplier),
    never by mutating MarketPrice.current_cost directly, so the event is
    fully reversible by construction: once ends_at passes, it just stops
    applying, nothing needs to be undone.
    """
    id = db.Column(db.Integer, primary_key=True)
    kind = db.Column(db.String(20), nullable=False)  # "price_spike" | "price_crash"
    category = db.Column(db.String(80), nullable=False)
    multiplier = db.Column(db.Float, nullable=False)
    starts_at = db.Column(db.DateTime(), default=utcnow)
    ends_at = db.Column(db.DateTime(), nullable=False)

    def serialize(self):
        return {
            # id is needed as a stable React key now that several events
            # can be live and rendered at once.
            "id": self.id,
            "kind": self.kind,
            "category": self.category,
            "multiplier": self.multiplier,
            "starts_at": self.starts_at.isoformat() if self.starts_at else None,
            "ends_at": self.ends_at.isoformat(),
        }


class ActivityLogEntry(db.Model):
    """
    Server-authoritative activity/notification log, replacing what used to
    be client-only state built from templated strings and persisted to
    localStorage. player_id set = that player's own activity (a buy, a
    mission result, ...); player_id NULL = a global entry (a market price
    notable move), same shared-scope pattern as MarketPrice/GameEvent.
    """
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=True)
    message = db.Column(db.String(300), nullable=False)
    type = db.Column(db.String(30), nullable=False, default="info")
    created_at = db.Column(db.DateTime(), default=utcnow)

    def serialize(self):
        return {"id": self.id, "message": self.message, "type": self.type}
