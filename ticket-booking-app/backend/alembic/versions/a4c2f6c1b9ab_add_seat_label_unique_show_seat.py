"""Add seat_label and unique show-seat constraint

Revision ID: a4c2f6c1b9ab
Revises: 9c88e9689ed8
Create Date: 2026-02-25 20:20:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a4c2f6c1b9ab"
down_revision: Union[str, Sequence[str], None] = "9c88e9689ed8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("bookings", sa.Column("seat_label", sa.String(), nullable=True))
    op.create_unique_constraint(
        "uq_booking_show_seat",
        "bookings",
        ["show_id", "seat_label"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_booking_show_seat", "bookings", type_="unique")
    op.drop_column("bookings", "seat_label")
