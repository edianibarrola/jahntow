"""
Shared Flask extension instances that need to be importable from both
app.py (to attach to the app) and routes.py (to use as decorators),
without causing a circular import between the two.
"""
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(get_remote_address, storage_uri="memory://")
