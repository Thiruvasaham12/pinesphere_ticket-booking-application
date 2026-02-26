from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.event import Event
from app.schemas.event import EventCreate

router = APIRouter()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🎬 Create Event
@router.post("/events")
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    new_event = Event(**event.model_dump())

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {"message": "Event created successfully"}


# 📋 List All Events
@router.get("/events")
def list_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return events
