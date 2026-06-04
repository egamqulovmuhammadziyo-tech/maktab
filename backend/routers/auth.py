from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token, get_current_admin, get_current_user
from ..models.user import User
from ..schemas.schemas import Token, UserCreate, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username yoki parol noto'g'ri",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Foydalanuvchi faol emas")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/users", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Bu username band")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Bu email band")
    user = User(
        username=data.username,
        email=data.email,
        full_name=data.full_name,
        hashed_password=get_password_hash(data.password),
        is_admin=data.is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(User).all()
