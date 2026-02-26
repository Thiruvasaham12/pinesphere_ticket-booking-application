from pydantic import BaseModel
from datetime import datetime


class ShowCreate(BaseModel):
    event_id: int
    theater_name: str
    show_time: datetime
    price: int
    total_seats: int


class ShowOut(BaseModel):
    id: int
    event_id: int
    theater_name: str
    show_time: datetime
    price: int
    total_seats: int

    class Config:
        from_attributes = True