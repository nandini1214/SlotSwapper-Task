from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class SwapStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"

class SwapCreate(BaseModel):
    my_slot_id: int
    their_slot_id: int

class SwapResponse(BaseModel):
    accept: bool  

class SwapShow(BaseModel):
    id: int
    requester_id: int
    receiver_id: int
    my_slot_id: int
    their_slot_id: int
    status: SwapStatus
    created_at: datetime

    class Config:
        orm_mode = True

class SwapUpdate(BaseModel):
    status: SwapStatus