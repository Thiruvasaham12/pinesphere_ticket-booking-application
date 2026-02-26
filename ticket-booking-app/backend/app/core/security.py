from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.user import User

# 🔐 Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔑 JWT settings
SECRET_KEY = "supersecretkey"  # later move to env variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# 🔐 Security scheme for JWT
security = HTTPBearer()


# 🔒 Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# 🔍 Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# 🎟️ Create JWT token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# 👤 Get current user from token
def get_user_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Fetch user from database
    db: Session = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return get_user_from_token(credentials.credentials)
