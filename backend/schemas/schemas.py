from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ── AUTH ──────────────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_admin: bool
    is_active: bool
    created_at: datetime
    class Config: from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    is_admin: bool = False

# ── TEACHER ───────────────────────────────────────────────────────────────────
class TeacherBase(BaseModel):
    name: str
    subject: str
    experience: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class TeacherCreate(TeacherBase): pass
class TeacherUpdate(TeacherBase): pass
class TeacherOut(TeacherBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True

# ── NEWS ──────────────────────────────────────────────────────────────────────
class NewsBase(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    tag: str = "Yangilik"
    image_url: Optional[str] = None
    published: bool = True

class NewsCreate(NewsBase): pass
class NewsUpdate(NewsBase): pass
class NewsOut(NewsBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True

# ── ANNOUNCEMENT ──────────────────────────────────────────────────────────────
class AnnouncementBase(BaseModel):
    title: str
    description: str
    icon: str = "🔔"
    type: str = "info"
    event_date: Optional[str] = None
    is_active: bool = True

class AnnouncementCreate(AnnouncementBase): pass
class AnnouncementUpdate(AnnouncementBase): pass
class AnnouncementOut(AnnouncementBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True

# ── CONTACT ───────────────────────────────────────────────────────────────────
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ContactOut(ContactCreate):
    id: int
    is_read: bool
    created_at: datetime
    class Config: from_attributes = True

# ── SCHEDULE ──────────────────────────────────────────────────────────────────
class ScheduleEntry(BaseModel):
    class_name: str
    day: str
    lesson_order: int
    subject: str

class ScheduleEntryOut(ScheduleEntry):
    id: int
    class Config: from_attributes = True

class ScheduleUpdate(BaseModel):
    entries: List[ScheduleEntry]

# ── ACHIEVEMENT ───────────────────────────────────────────────────────────────
class AchievementBase(BaseModel):
    title: str
    description: Optional[str] = None
    icon: str = "🏆"
    year: Optional[str] = None

class AchievementCreate(AchievementBase): pass
class AchievementOut(AchievementBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True

# ── GALLERY ───────────────────────────────────────────────────────────────────
class GalleryBase(BaseModel):
    title: Optional[str] = None
    image_url: str
    category: str = "Umumiy"

class GalleryCreate(GalleryBase): pass
class GalleryOut(GalleryBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True
