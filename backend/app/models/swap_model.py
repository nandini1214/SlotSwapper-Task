from sqlalchemy import Column, Integer, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base
import enum

class SwapStatus(enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"

class SwapRequest(Base):
    __tablename__ = "swap_requests"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # User who requests
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)   # User who owns the requested slot

    my_slot_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    their_slot_id = Column(Integer, ForeignKey("events.id"), nullable=False)

    status = Column(Enum(SwapStatus), default=SwapStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    requester = relationship("User", foreign_keys=[requester_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    my_slot = relationship("Event", foreign_keys=[my_slot_id])
    their_slot = relationship("Event", foreign_keys=[their_slot_id])
