import os
import secrets
from flask import request, Response
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.theme import Bootstrap4Theme
from .models import db, User, Player
from flask_admin.contrib.sqla import ModelView


def _check_admin_auth():
    admin_user = os.environ.get('ADMIN_USERNAME')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    if not admin_user or not admin_password:
        return False

    auth = request.authorization
    if not auth:
        return False

    return (
        secrets.compare_digest(auth.username or '', admin_user)
        and secrets.compare_digest(auth.password or '', admin_password)
    )


class SecureAdminMixin:
    def is_accessible(self):
        return _check_admin_auth()

    def inaccessible_callback(self, name, **kwargs):
        return Response(
            "Admin access requires authentication.", 401,
            {"WWW-Authenticate": 'Basic realm="Admin"'}
        )


class SecureAdminIndexView(SecureAdminMixin, AdminIndexView):
    pass


class SecureModelView(SecureAdminMixin, ModelView):
    pass


class UserModelView(SecureModelView):
    # Never expose the password hash through the admin UI
    column_exclude_list = ['password']
    form_excluded_columns = ['password']


def setup_admin(app):
    app_key = os.environ.get('FLASK_APP_KEY')
    if not app_key:
        if os.environ.get('FLASK_ENV') == 'development':
            app_key = 'dev-only-insecure-key-do-not-use-in-production'
        else:
            raise RuntimeError(
                "FLASK_APP_KEY environment variable must be set in production."
            )
    app.secret_key = app_key

    if not os.environ.get('ADMIN_USERNAME') or not os.environ.get('ADMIN_PASSWORD'):
        if os.environ.get('FLASK_ENV') != 'development':
            # No admin credentials configured: don't expose the panel at all
            # rather than serving it unauthenticated.
            return

    admin = Admin(
        app, name='Jahntow Admin',
        theme=Bootstrap4Theme(swatch='cerulean'),
        index_view=SecureAdminIndexView(),
    )

    admin.add_view(UserModelView(User, db.session))
    admin.add_view(SecureModelView(Player, db.session))
