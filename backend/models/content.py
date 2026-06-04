from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from ..core.database import Base

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    experience = Column(String)
    bio = Column(Text)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(Text)
    content = Column(Text)
    tag = Column(String, default="Yangilik")
    image_url = Column(String)
    published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, default="🔔")
    type = Column(String, default="info")  # urgent | info | event
    event_date = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    subject = Column(String)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String, nullable=False)   # "5-A"
    day = Column(String, nullable=False)           # "Dushanba"
    lesson_order = Column(Integer, nullable=False) # 1-6
    subject = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String, default="🏆")
    year = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GalleryImage(Base):
    __tablename__ = "gallery"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    image_url = Column(String, nullable=False)
    category = Column(String, default="Umumiy")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SiteSettings(Base):
    __tablename__ = "site_settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    value = Column(Text)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
