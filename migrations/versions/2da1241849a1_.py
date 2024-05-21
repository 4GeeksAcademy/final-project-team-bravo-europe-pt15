"""empty message

Revision ID: 2da1241849a1
Revises: bd259ca152b9
Create Date: 2024-05-19 08:42:07.515084

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2da1241849a1'
down_revision = 'bd259ca152b9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transformed_image',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(length=255), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transformed_image')
    # ### end Alembic commands ###