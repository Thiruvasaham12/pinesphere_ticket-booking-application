import re
import uuid
import os
import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import SessionLocal
from app.core.redis_client import redis_client
from app.core.security import get_current_user
from app.models.booking import Booking
from app.models.event import Event
from app.models.show import Show
from app.models.user import User
from app.schemas.booking import BookingCreate
from app.tasks import send_booking_confirmation

router = APIRouter()
SEAT_PATTERN = re.compile(r"^[A-H](10|[1-9])$")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def normalize_seat_label(seat: str) -> str:
    return seat.strip().upper()


def seat_number_from_label(seat_label: str) -> int:
    return int(re.sub(r"^[A-Z]", "", seat_label))


@router.get("/booked-seats/{show_id}")
def get_booked_seats(show_id: int, db: Session = Depends(get_db)):
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")

    try:
        db_seats = [
            row[0]
            for row in db.query(Booking.seat_label)
            .filter(Booking.show_id == show_id, Booking.seat_label.isnot(None))
            .all()
        ]
    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Database schema is outdated. Run alembic upgrade head and restart backend.",
        )

    redis_key = f"show:{show_id}:booked_seats"
    if db_seats:
        redis_client.sadd(redis_key, *db_seats)

    redis_seats = list(redis_client.smembers(redis_key))
    return {"show_id": show_id, "booked_seats": sorted(set(redis_seats))}


@router.post("/book")
def book_ticket(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = db.query(Event).filter(Event.id == booking.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    show = (
        db.query(Show)
        .filter(Show.id == booking.show_id, Show.event_id == booking.event_id)
        .first()
    )
    if not show:
        raise HTTPException(status_code=404, detail="Show not found for this event")

    if not booking.seats:
        raise HTTPException(status_code=400, detail="At least one seat is required")

    normalized_seats = [normalize_seat_label(seat) for seat in booking.seats]
    if len(set(normalized_seats)) != len(normalized_seats):
        raise HTTPException(status_code=400, detail="Duplicate seats selected")

    invalid = [seat for seat in normalized_seats if not SEAT_PATTERN.match(seat)]
    if invalid:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid seat labels: {', '.join(invalid)}",
        )

    try:
        already_in_db = {
            row[0]
            for row in db.query(Booking.seat_label)
            .filter(Booking.show_id == booking.show_id, Booking.seat_label.in_(normalized_seats))
            .all()
        }
    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Database schema is outdated. Run alembic upgrade head and restart backend.",
        )
    if already_in_db:
        raise HTTPException(
            status_code=400,
            detail=f"Seat(s) already booked: {', '.join(sorted(already_in_db))}",
        )

    redis_key = f"show:{booking.show_id}:booked_seats"
    newly_locked = []
    for seat in normalized_seats:
        added = redis_client.sadd(redis_key, seat)
        if added == 0:
            if newly_locked:
                redis_client.srem(redis_key, *newly_locked)
            raise HTTPException(status_code=400, detail=f"Seat already booked: {seat}")
        newly_locked.append(seat)

    booking_reference = f"BMS-{uuid.uuid4().hex[:8].upper()}"
    try:
        new_bookings = []
        for seat in normalized_seats:
            item = Booking(
                user_id=current_user.id,
                event_id=booking.event_id,
                show_id=booking.show_id,
                seat_label=seat,
                seat_number=seat_number_from_label(seat),
            )
            db.add(item)
            new_bookings.append(item)

        db.commit()
        for item in new_bookings:
            db.refresh(item)
    except Exception:
        db.rollback()
        if newly_locked:
            redis_client.srem(redis_key, *newly_locked)
        raise

    try:
        send_booking_confirmation.delay(
            user_email=current_user.email,
            user_name=current_user.name,
            admin_email=os.environ.get("ADMIN_EMAIL", "admin1@gmail.com"),
            booking_reference=booking_reference,
            event_title=event.title,
            event_location=event.location,
            show_time=show.show_time.isoformat() if isinstance(show.show_time, datetime) else str(show.show_time),
            theater_name=show.theater_name,
            seat_labels=normalized_seats,
            total_amount=show.price * len(normalized_seats),
        )
    except Exception as e:
        # Booking is already committed. Email queue issues should not fail booking.
        print(f"[WARN] Booking email task enqueue failed: {e}")

    try:
        redis_client.publish(
            f"notifications:user:{current_user.id}",
            json.dumps(
                {
                    "type": "booking_confirmed",
                    "message": f"Booking confirmed for {event.title}: {', '.join(normalized_seats)}",
                    "booking_reference": booking_reference,
                }
            ),
        )
    except Exception as e:
        print(f"[WARN] Notification publish failed: {e}")

    return {
        "message": "Ticket booked successfully",
        "booking_reference": booking_reference,
        "event_id": booking.event_id,
        "show_id": booking.show_id,
        "seats": normalized_seats,
    }
