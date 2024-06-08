"""empty message

Revision ID: 76b780e16abd
Revises: facf82d8f06d
Create Date: 2024-05-15 18:50:44.970929

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '76b780e16abd'
down_revision = 'facf82d8f06d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=80), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('username')

    # ### end Alembic commands ###