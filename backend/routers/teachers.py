from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.security import get_current_admin
from ..models.user import User
from ..models.content import Teacher
from ..schemas.schemas import TeacherCreate, TeacherUpdate, TeacherOut

router = APIRouter(prefix="/api/teachers", tags=["teachers"])

@router.get("", response_model=List[TeacherOut])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(Teacher).filter(Teacher.is_active == True).all()

@router.get("/all", response_model=List[TeacherOut])
def get_all_teachers(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(Teacher).all()

@router.post("", response_model=TeacherOut)
def create_teacher(data: TeacherCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    t = Teacher(**data.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

@router.put("/{teacher_id}", response_model=TeacherOut)
def update_teacher(teacher_id: int, data: TeacherUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    t = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="O'qituvchi topilmadi")
    for k, v in data.model_dump().items():
        setattr(t, k, v)
    db.commit()
    db.refresh(t)
    return t

@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    t = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="O'qituvchi topilmadi")
    db.delete(t)
    db.commit()
    return {"ok": True}
