from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.core.database import Base


class Show(Base):
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    theater_name = Column(String)
    show_time = Column(DateTime)
    price = Column(Integer)
    total_seats = Column(Integer)