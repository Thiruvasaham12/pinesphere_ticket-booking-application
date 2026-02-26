from typing import List, Optional
from pydantic import BaseModel

class BookingCreate(BaseModel):
    event_id: int
    show_id: int
    seats: List[str]
    seat_number: Optional[int] = None
