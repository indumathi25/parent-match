"""Add users table and auth0_sub to posts

Revision ID: a3f9e1d2b4c7
Revises: 72f481ed9f09
Create Date: 2026-05-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


revision: str = 'a3f9e1d2b4c7'
down_revision: Union[str, None] = '72f481ed9f09'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('auth0_sub', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('email', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('auth0_sub'),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_auth0_sub'), 'users', ['auth0_sub'], unique=True)

    op.add_column('posts', sa.Column('auth0_sub', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    op.create_index(op.f('ix_posts_auth0_sub'), 'posts', ['auth0_sub'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_posts_auth0_sub'), table_name='posts')
    op.drop_column('posts', 'auth0_sub')

    op.drop_index(op.f('ix_users_auth0_sub'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
