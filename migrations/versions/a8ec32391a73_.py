"""empty message

Revision ID: a8ec32391a73
Revises: c856cedbc9a4
Create Date: 2023-08-14 20:07:53.263512

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a8ec32391a73'
down_revision = 'c856cedbc9a4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('player', schema=None) as batch_op:
        batch_op.add_column(sa.Column('maxHealth', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('maxEnergy', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('player', schema=None) as batch_op:
        batch_op.drop_column('maxEnergy')
        batch_op.drop_column('maxHealth')

    # ### end Alembic commands ###