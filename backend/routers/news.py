from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.security import get_current_admin
from ..models.user import User
from ..models.content import News
from ..schemas.schemas import NewsCreate, NewsUpdate, NewsOut

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("", response_model=List[NewsOut])
def get_news(db: Session = Depends(get_db)):
    return db.query(News).filter(News.published == True).order_by(News.created_at.desc()).all()

@router.get("/all", response_model=List[NewsOut])
def get_all_news(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(News).order_by(News.created_at.desc()).all()

@router.get("/{news_id}", response_model=NewsOut)
def get_single(news_id: int, db: Session = Depends(get_db)):
    n = db.query(News).filter(News.id == news_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Yangilik topilmadi")
    return n

@router.post("", response_model=NewsOut)
def create_news(data: NewsCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    n = News(**data.model_dump())
    db.add(n)
    db.commit()
    db.refresh(n)
    return n

@router.put("/{news_id}", response_model=NewsOut)
def update_news(news_id: int, data: NewsUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    n = db.query(News).filter(News.id == news_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Yangilik topilmadi")
    for k, v in data.model_dump().items():
        setattr(n, k, v)
    db.commit()
    db.refresh(n)
    return n

@router.delete("/{news_id}")
def delete_news(news_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    n = db.query(News).filter(News.id == news_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Yangilik topilmadi")
    db.delete(n)
    db.commit()
    return {"ok": True}
