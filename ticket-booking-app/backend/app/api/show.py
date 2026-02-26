from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.show import Show
from app.schemas.show import ShowCreate, ShowOut

router = APIRouter(prefix="/shows", tags=["Shows"])


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ➕ Create show (Admin)
@router.post("/", response_model=ShowOut)
def create_show(show: ShowCreate, db: Session = Depends(get_db)):
    new_show = Show(**show.model_dump())

    db.add(new_show)
    db.commit()
    db.refresh(new_show)

    return new_show


# 📋 List shows for a movie
@router.get("/event/{event_id}", response_model=list[ShowOut])
def list_shows(event_id: int, db: Session = Depends(get_db)):
    shows = db.query(Show).filter(Show.event_id == event_id).all()
    return shows