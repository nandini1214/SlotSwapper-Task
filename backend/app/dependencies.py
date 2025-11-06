from app.db import sessionLocal
from fastapi.security import HTTPBearer , HTTPAuthorizationCredentials
from fastapi import Depends ,HTTPException, status
from sqlalchemy.orm import session
from app import models
from app.auth.jwt_handler import SECRET_KEY, ALGORITHM
from jwt import PyJWTError
import jwt
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()
security = HTTPBearer()
print(SECRET_KEY)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(models.user_model.User).filter(models.user_model.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
   