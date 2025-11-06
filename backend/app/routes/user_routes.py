from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import session
from app import models, schemas, utils
from app.dependencies import get_db, get_current_user
from app.auth.jwt_handler import create_access_token
from app.utils import verify_password
router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.user_schema.UserResponse,
)
def create_user(user: schemas.UserCreate, db: session = Depends(get_db)):
    existing_user = (
        db.query(models.user_model.User)
        .filter(models.user_model.User.email == user.email)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email {user.email} already exists",
        )
    hash_pw = utils.hashed_password(user.password)
    new_user = models.user_model.User(
        email=user.email, name=user.name, hashed_password=hash_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login_user(
    user_credentials: schemas.user_schema.LoginSchema,
    db: session = Depends(get_db)
):
    user = (
        db.query(models.user_model.User)
        .filter(models.user_model.User.email == user_credentials.email)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"User with email {user_credentials.email} does not exist",
        )
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
        )

    # ✅ Include both email and id in token
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }

@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    print("current_user:", current_user.email)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }   

@router.get("/", response_model=list[schemas.user_schema.UserResponse])
def get_users(db: session = Depends(get_db)):
    all_users = db.query(models.user_model.User).all()
    return all_users
