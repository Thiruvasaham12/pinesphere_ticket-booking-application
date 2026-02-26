"""Initial migration

Revision ID: 8f51b5691651
Revises:
Create Date: 2026-02-25 11:59:43.271952

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8f51b5691651"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password", sa.String(), nullable=False),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # events
    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("event_type", sa.String(), nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column("date_time", sa.DateTime(), nullable=False),
        sa.Column("total_seats", sa.Integer(), nullable=False),
        sa.Column("banner_url", sa.String(), nullable=True),
    )
    op.create_index("ix_events_id", "events", ["id"], unique=False)

    # shows
    op.create_table(
        "shows",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("event_id", sa.Integer(), nullable=False),
        sa.Column("theater_name", sa.String(), nullable=True),
        sa.Column("show_time", sa.DateTime(), nullable=True),
        sa.Column("price", sa.Integer(), nullable=True),
        sa.Column("total_seats", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["event_id"], ["events.id"], name="fk_shows_event_id_events"),
    )
    op.create_index("ix_shows_id", "shows", ["id"], unique=False)

    # bookings (user_id + event_id are added in next migration)
    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("show_id", sa.Integer(), nullable=True),
        sa.Column("seat_number", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["show_id"], ["shows.id"], name="fk_bookings_show_id_shows"),
    )
    op.create_index("ix_bookings_id", "bookings", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_bookings_id", table_name="bookings")
    op.drop_table("bookings")

    op.drop_index("ix_shows_id", table_name="shows")
    op.drop_table("shows")

    op.drop_index("ix_events_id", table_name="events")
    op.drop_table("events")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
