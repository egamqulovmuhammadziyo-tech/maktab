from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict
from ..core.database import get_db
from ..core.security import get_current_admin
from ..models.user import User
from ..models.content import SiteSettings

router = APIRouter(prefix="/api/settings", tags=["settings"])

DEFAULT_SETTINGS = {
    "school_name": "17-Maktab",
    "school_subtitle": "Umumiy O'rta Ta'lim",
    "school_description": "Farg'ona viloyati Beshariq tumanida zamonaviy ta'lim beruvchi, o'quvchilarni kelajakka tayyorlovchi maktab.",
    "phone": "+998 73 540 00 17",
    "email": "info@17maktab.uz",
    "address": "Farg'ona viloyati, Beshariq tumani, Sobirtepa qishlog'i",
    "facebook": "https://facebook.com",
    "instagram": "https://instagram.com",
    "telegram": "https://t.me/maktab17",
    "youtube": "",
    "hero_title": "Bilim va Kelajak",
    "hero_subtitle": "Zamonaviy ta'lim, innovatsion yondashuv, yorqin kelajak",
    "students_count": "1200+",
    "teachers_count": "68",
    "experience_years": "20+",
    "subjects_count": "45",
    "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.1234567890123!2d70.54!3d40.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s17-Maktab!5e0!3m2!1suz!2s!4v1234567890",
}

@router.get("")
def get_settings(db: Session = Depends(get_db)):
    rows = db.query(SiteSettings).all()
    result = dict(DEFAULT_SETTINGS)
    for row in rows:
        result[row.key] = row.value
    return result

@router.put("")
def update_settings(data: Dict[str, str], db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    for key, value in data.items():
        existing = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if existing:
            existing.value = value
        else:
            db.add(SiteSettings(key=key, value=value))
    db.commit()
    return {"ok": True}
