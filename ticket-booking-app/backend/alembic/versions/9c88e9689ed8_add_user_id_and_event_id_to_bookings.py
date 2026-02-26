"""Add user_id and event_id to Bookings

Revision ID: 9c88e9689ed8
Revises: 8f51b5691651
Create Date: 2026-02-25 12:04:56.021557

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9c88e9689ed8'
down_revision: Union[str, Sequence[str], None] = '8f51b5691651'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('bookings', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('bookings', sa.Column('event_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_bookings_event_id_events',
        'bookings',
        'events',
        ['event_id'],
        ['id'],
    )
    op.create_foreign_key(
        'fk_bookings_user_id_users',
        'bookings',
        'users',
        ['user_id'],
        ['id'],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_bookings_user_id_users', 'bookings', type_='foreignkey')
    op.drop_constraint('fk_bookings_event_id_events', 'bookings', type_='foreignkey')
    op.drop_column('bookings', 'event_id')
    op.drop_column('bookings', 'user_id')
