import click
from argon2 import PasswordHasher
from api.models import db, User, Player

ph = PasswordHasher()


def setup_commands(app):

    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        """Create N test accounts (test_user1@test.com.. password "123456"),
        each with a default Player, for local testing."""
        print("Creating test users")
        for x in range(1, int(count) + 1):
            email = f"test_user{x}@test.com"
            user = User(email=email, password=ph.hash("123456"), is_active=True)
            db.session.add(user)
            db.session.flush()
            db.session.add(Player(name=f"TestPlayer{x}", user_id=user.id))
            db.session.commit()
            print("User:", email, "created.")

        print("All test users created")
