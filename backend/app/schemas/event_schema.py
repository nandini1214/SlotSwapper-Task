from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from app.schemas.user_schema import UserResponse
class EventStatus(str, Enum):
    BUSY = "BUSY"
    SWAPPABLE = "SWAPPABLE"
    SWAP_PENDING = "SWAP_PENDING"

class EventBase(BaseModel):
    title: str
    start_time :  datetime
    end_time : datetime
    status: EventStatus = EventStatus.BUSY

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    user_id: int
    user : UserResponse | None = None
    created_at: datetime
    class Config:
        orm_mode = True
