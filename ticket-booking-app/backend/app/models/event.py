from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    date_time = Column(DateTime, nullable=False)
    total_seats = Column(Integer, nullable=False)
    banner_url = Column(String, nullable=True)  # ✅ NEW