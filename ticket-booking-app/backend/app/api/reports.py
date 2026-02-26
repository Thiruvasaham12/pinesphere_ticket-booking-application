from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import SessionLocal
from app.models.booking import Booking
from app.models.event import Event
from app.models.show import Show
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_admin(user: User):
    role = "admin" if user.email in ["admin@sample.com", "admin1@gmail.com"] else "user"
    if role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admin access required.")


# 📊 1. Total Bookings (Admin Only)
@router.get("/total-bookings")
def get_total_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    total = db.query(Booking).count()
    return {"total_bookings": total}


# 📊 2. Event-wise Bookings (Admin Only)
@router.get("/event-wise-bookings")
def get_event_wise_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_admin(current_user)
    
    # Needs a join if booking is linked directly to event. 
    # Current booking model: event_id and seat_number.
    results = (
        db.query(
            Event.id,
            Event.title,
            func.count(Booking.id).label("total_booked")
        )
        .outerjoin(Booking, Event.id == Booking.event_id)
        .group_by(Event.id)
        .all()
    )
    
    # Format the results
    report = []
    for r in results:
        report.append({
            "event_id": r.id,
            "title": r.title,
            "total_booked": r.total_booked
        })
        
    return report


# 📊 3. User Booking History
@router.get("/my-bookings")
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch all bookings for the currently authenticated user
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    
    result = []
    for b in bookings:
        event = db.query(Event).filter(Event.id == b.event_id).first()
        show = db.query(Show).filter(Show.id == b.show_id).first() if b.show_id else None
        result.append({
            "id": b.id,
            "event_title": event.title if event else "Unknown",
            "seat_number": b.seat_label or b.seat_number,
            "location": event.location if event else "Unknown",
            "date": show.show_time if show else (event.date_time if event else "Unknown"),
            "show_id": b.show_id,
        })
        
    return result
