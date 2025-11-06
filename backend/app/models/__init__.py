# app/models/__init__.py
from app.db import Base
from app.models.user_model import User  # ✅ make sure it's user_model, not users_model
from app.models.event_model import Event
from app.models.swap_model import SwapRequest
__all__ = ["Base", "User" , "Event", "SwapRequest"]
