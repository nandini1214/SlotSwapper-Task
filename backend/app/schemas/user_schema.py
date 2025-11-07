from pydantic import BaseModel, EmailStr
from pydantic.types import constr
from datetime import datetime

# Shared user attributes
class UserBase(BaseModel):
    
    name: str
    email: EmailStr

# For user creation (includes password)
class UserCreate(UserBase):
    password: constr(min_length=8,max_length=72)

# Response model (what we return to frontend)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
class LoginSchema(BaseModel):
    email : EmailStr
    password : constr(min_length=8,max_length=72)