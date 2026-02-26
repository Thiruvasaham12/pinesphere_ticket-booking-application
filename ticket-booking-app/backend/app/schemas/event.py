from pydantic import BaseModel
from datetime import datetime


class EventCreate(BaseModel):
    title: str
    event_type: str
    location: str
    date_time: datetime
    total_seats: int
    banner_url: str | None = None

