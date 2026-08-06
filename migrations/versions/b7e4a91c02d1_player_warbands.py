"""player warbands - allied tribal forces the player funds and provisions

Revision ID: b7e4a91c02d1
Revises: 2447cd3ab357
Create Date: 2026-08-05
"""
from alembic import op
import sqlalchemy as sa

revision = 'b7e4a91c02d1'
down_revision = '2447cd3ab357'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('player', schema=None) as batch_op:
        batch_op.add_column(sa.Column('warbands', sa.JSON(), nullable=True))


def downgrade():
    with op.batch_alter_table('player', schema=None) as batch_op:
        batch_op.drop_column('warbands')
