from sqlalchemy import Column, Integer, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        UniqueConstraint("show_id", "seat_label", name="uq_booking_show_seat"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    show_id = Column(Integer, ForeignKey("shows.id"), nullable=True)
    seat_number = Column(Integer)
    seat_label = Column(String, nullable=True)
    
    # Relationships for easier querying
    user = relationship("User")
    event = relationship("Event")
    show = relationship("Show")
