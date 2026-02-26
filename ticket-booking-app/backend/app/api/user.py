from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.schemas.auth import LoginRequest
from fastapi import HTTPException

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate

router = APIRouter()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)  # 🔐 hashed password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}
@router.post("/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})

   # check role
    role = "admin" if user.email in ["admin@sample.com", "admin1@gmail.com"] else "user"

    return {
    "access_token": token,
    "token_type": "bearer",
    "role": role
}