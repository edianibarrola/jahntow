"""game_event.ended_notified: marks events whose expiry has been announced

Price-event multipliers stop applying the moment ends_at passes, but
nothing ever said so - players read the countdown as decorative. The feed
now announces the revert once per event; this flag is what makes it once.

Revision ID: f2d8c4a9e711
Revises: b7e4a91c02d1
Create Date: 2026-08-06

"""
from alembic import op
import sqlalchemy as sa

revision = 'f2d8c4a9e711'
down_revision = 'b7e4a91c02d1'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('game_event', schema=None) as batch_op:
        batch_op.add_column(sa.Column(
            'ended_notified', sa.Boolean(), nullable=False,
            server_default=sa.false(),
        ))


def downgrade():
    with op.batch_alter_table('game_event', schema=None) as batch_op:
        batch_op.drop_column('ended_notified')
