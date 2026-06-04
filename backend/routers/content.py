import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.security import get_current_admin
from ..models.user import User
from ..models.content import Announcement, Contact, Schedule, Achievement, GalleryImage
from ..schemas.schemas import (
    AnnouncementCreate, AnnouncementUpdate, AnnouncementOut,
    ContactCreate, ContactOut,
    ScheduleEntry, ScheduleEntryOut, ScheduleUpdate,
    AchievementCreate, AchievementOut,
    GalleryCreate, GalleryOut,
)

# ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
announce_router = APIRouter(prefix="/api/announcements", tags=["announcements"])

@announce_router.get("", response_model=List[AnnouncementOut])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).filter(Announcement.is_active == True).order_by(Announcement.created_at.desc()).all()

@announce_router.get("/all", response_model=List[AnnouncementOut])
def get_all(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()

@announce_router.post("", response_model=AnnouncementOut)
def create(data: AnnouncementCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    a = Announcement(**data.model_dump())
    db.add(a); db.commit(); db.refresh(a); return a

@announce_router.put("/{aid}", response_model=AnnouncementOut)
def update(aid: int, data: AnnouncementUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    a = db.query(Announcement).filter(Announcement.id == aid).first()
    if not a: raise HTTPException(404, "Topilmadi")
    for k, v in data.model_dump().items(): setattr(a, k, v)
    db.commit(); db.refresh(a); return a

@announce_router.delete("/{aid}")
def delete(aid: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    a = db.query(Announcement).filter(Announcement.id == aid).first()
    if not a: raise HTTPException(404, "Topilmadi")
    db.delete(a); db.commit(); return {"ok": True}

# ── CONTACT ───────────────────────────────────────────────────────────────────
contact_router = APIRouter(prefix="/api/contact", tags=["contact"])

@contact_router.post("", response_model=ContactOut)
def send_contact(data: ContactCreate, db: Session = Depends(get_db)):
    c = Contact(**data.model_dump())
    db.add(c); db.commit(); db.refresh(c); return c

@contact_router.get("", response_model=List[ContactOut])
def get_contacts(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(Contact).order_by(Contact.created_at.desc()).all()

@contact_router.patch("/{cid}/read")
def mark_read(cid: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    c = db.query(Contact).filter(Contact.id == cid).first()
    if not c: raise HTTPException(404, "Topilmadi")
    c.is_read = True; db.commit(); return {"ok": True}

@contact_router.delete("/{cid}")
def del_contact(cid: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    c = db.query(Contact).filter(Contact.id == cid).first()
    if not c: raise HTTPException(404, "Topilmadi")
    db.delete(c); db.commit(); return {"ok": True}

# ── SCHEDULE ──────────────────────────────────────────────────────────────────
schedule_router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@schedule_router.get("", response_model=List[ScheduleEntryOut])
def get_schedule(db: Session = Depends(get_db)):
    return db.query(Schedule).order_by(Schedule.class_name, Schedule.day, Schedule.lesson_order).all()

@schedule_router.get("/{class_name}", response_model=List[ScheduleEntryOut])
def get_class_schedule(class_name: str, db: Session = Depends(get_db)):
    return db.query(Schedule).filter(Schedule.class_name == class_name).order_by(Schedule.day, Schedule.lesson_order).all()

@schedule_router.put("")
def update_schedule(data: ScheduleUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    if data.entries:
        class_names = list(set(e.class_name for e in data.entries))
        db.query(Schedule).filter(Schedule.class_name.in_(class_names)).delete(synchronize_session=False)
    for e in data.entries:
        s = Schedule(**e.model_dump())
        db.add(s)
    db.commit()
    return {"ok": True, "count": len(data.entries)}

# ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────
ach_router = APIRouter(prefix="/api/achievements", tags=["achievements"])

@ach_router.get("", response_model=List[AchievementOut])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).order_by(Achievement.year.desc()).all()

@ach_router.post("", response_model=AchievementOut)
def create_ach(data: AchievementCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    a = Achievement(**data.model_dump())
    db.add(a); db.commit(); db.refresh(a); return a

@ach_router.put("/{aid}", response_model=AchievementOut)
def update_ach(aid: int, data: AchievementCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    a = db.query(Achievement).filter(Achievement.id == aid).first()
    if not a: raise HTTPException(404, "Topilmadi")
    for k, v in data.model_dump().items(): setattr(a, k, v)
    db.commit(); db.refresh(a); return a

@ach_router.delete("/{aid}")
def delete_ach(aid: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    a = db.query(Achievement).filter(Achievement.id == aid).first()
    if not a: raise HTTPException(404, "Topilmadi")
    db.delete(a); db.commit(); return {"ok": True}

# ── GALLERY ───────────────────────────────────────────────────────────────────
gallery_router = APIRouter(prefix="/api/gallery", tags=["gallery"])

@gallery_router.get("", response_model=List[GalleryOut])
def get_gallery(db: Session = Depends(get_db)):
    return db.query(GalleryImage).order_by(GalleryImage.created_at.desc()).all()

@gallery_router.post("", response_model=GalleryOut)
def add_image(data: GalleryCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    g = GalleryImage(**data.model_dump())
    db.add(g); db.commit(); db.refresh(g); return g

@gallery_router.delete("/{gid}")
def del_image(gid: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    g = db.query(GalleryImage).filter(GalleryImage.id == gid).first()
    if not g: raise HTTPException(404, "Topilmadi")
    db.delete(g); db.commit(); return {"ok": True}


# ── RASM YUKLASH TIZIMI (YANGI QO'SHILGAN QISM) ──────────────────────────────────
# ── RASM YUKLASH TIZIMI (TO'G'RILANGAN VA DINAMIK VARIANTI) ─────────────────────
from fastapi import Request # Faylning eng tepasiga qo'shilsa ham bo'ladi

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@gallery_router.post("/upload") # <-- @router o'rniga @gallery_router qilindi
async def upload_image(request: Request, file: UploadFile = File(...), _: User = Depends(get_current_admin)):
    """Kompyuter yoki telefondan rasm yuklash xizmati (Adminlar uchun)"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Faqat rasm formatidagi fayllarni yuklash mumkin!")
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    # base_url ertaga domen sotib olsangiz ham avtomatik moslashib oladi!
    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}/api/gallery/images/{unique_filename}"
    
    return {"message": "Rasm yuklandi!", "url": image_url}

@gallery_router.get("/images/{filename}") # <-- @router o'rniga @gallery_router qilindi
async def get_image(filename: str):
    """Yuklangan rasmlarni brauzerda ochib berish yo'lagi"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Rasm topilmadi")
    return FileResponse(file_path)