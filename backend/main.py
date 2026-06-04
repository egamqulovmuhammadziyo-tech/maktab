from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Mana bu yerda hammasini "backend." dan boshlab yozamiz
from backend.core.database import engine, SessionLocal
from backend.models import user, content
from backend.core.security import get_password_hash
from backend.routers.auth import router as auth_router
from backend.routers.teachers import router as teachers_router
from backend.routers.news import router as news_router
from backend.routers.settings import router as settings_router
from backend.routers.content import (
    announce_router, contact_router,
    schedule_router, ach_router, gallery_router,
)

# Bu yerda pastda qolgan kodlaringiz (app.include_router va h.k.) turaveradi...
user.Base.metadata.create_all(bind=engine)
content.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="17-Maktab API",
    description="Farg'ona viloyati Beshariq tumani 17-maktab rasmiy API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(teachers_router)
app.include_router(news_router)
app.include_router(announce_router)
app.include_router(contact_router)
app.include_router(schedule_router)
app.include_router(ach_router)
app.include_router(gallery_router)
app.include_router(settings_router)

@app.get("/")
def root():
    return {"message": "17-Maktab API ishlayapti!"}

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        from .models.user import User
        if not db.query(User).filter(User.username == "admin").first():
            db.add(User(
                username="admin", email="admin@17maktab.uz",
                full_name="Maktab Administratori",
                hashed_password=get_password_hash("admin123"),
                is_admin=True,
            ))

        from .models.content import Teacher, News, Announcement, Achievement, Schedule
        if not db.query(Teacher).first():
            db.add_all([
                Teacher(name="Nilufar Karimova", subject="Matematika", experience="12 yil tajriba", image_url="https://i.pravatar.cc/150?img=47"),
                Teacher(name="Bekzod Ergashev", subject="Fizika", experience="9 yil tajriba", image_url="https://i.pravatar.cc/150?img=12"),
                Teacher(name="Dilnoza Akhmedova", subject="Ingliz tili", experience="15 yil tajriba", image_url="https://i.pravatar.cc/150?img=48"),
                Teacher(name="Ozodbek Ismoilov", subject="Tarix", experience="8 yil tajriba", image_url="https://i.pravatar.cc/150?img=15"),
                Teacher(name="Madina Tursunova", subject="Biologiya", experience="11 yil tajriba", image_url="https://i.pravatar.cc/150?img=49"),
                Teacher(name="Sardor G'aniyev", subject="Informatika", experience="7 yil tajriba", image_url="https://i.pravatar.cc/150?img=11"),
            ])

        if not db.query(News).first():
            db.add_all([
                News(title="Respublika tanlovida 1-o'rin", tag="Yutuq", excerpt="17-maktab yosh iste'dodlari muhim sovrinlarni qo'lga kiritdi.", image_url="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"),
                News(title="Yangi STEM laboratoriyasi ochildi", tag="Yangilik", excerpt="Innovatsion laboratoriya o'quvchilarga raqamli texnologiyalarni o'rganishga yordam beradi.", image_url="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"),
                News(title="Xalqaro pedagogika konferensiyasi", tag="Ta'lim", excerpt="O'qituvchilarimiz yangi pedagogik yondashuvlarni jahon tajribasidan o'rganishdi.", image_url="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"),
            ])

        if not db.query(Announcement).first():
            db.add_all([
                Announcement(title="Ota-onalar majlisi", description="Barcha sinf ota-onalari uchun majlis soat 18:00 da bo'lib o'tadi.", icon="🔔", type="urgent", event_date="28 May 2026"),
                Announcement(title="Yozgi ta'til jadvali", description="Yozgi ta'til 1-iyundan boshlanadi.", icon="📚", type="info", event_date="1 Iyun 2026"),
                Announcement(title="Olimpiada ro'yxatga olish", description="Matematika olimpiadasiga ishtirokchilar ro'yxatga olish boshlandi.", icon="🏆", type="event", event_date="25 May 2026"),
            ])

        if not db.query(Achievement).first():
            db.add_all([
                Achievement(title="STEM olimpiadasida 1-o'rin", description="O'quvchilarimiz mintaqaviy STEM tanlovida birinchi o'rinni egalladi.", icon="🥇", year="2026"),
                Achievement(title="ISO sertifikatsiyasi", description="Maktab xalqaro ta'lim standartlari bo'yicha sertifikatsiyalandi.", icon="📜", year="2025"),
                Achievement(title="Top 10 maktablar ro'yxati", description="O'zbekiston ta'lim reitingida yuqori o'rin.", icon="🌟", year="2024"),
            ])

        if not db.query(Schedule).first():
            subjects_5a = {
                "Dushanba":   ["Matematika","O'zbek tili","Tarix","Fizika","Ingliz tili",""],
                "Seshanba":   ["Biologiya","Kimyo","Adabiyot","Matematika","Musiqa",""],
                "Chorshanba": ["Fizika","Ingliz tili","Geografiya","O'zbek tili","Informatika",""],
                "Payshanba":  ["Tarix","Matematika","Kimyo","Biologiya","Rus tili",""],
                "Juma":       ["O'zbek tili","Fizika","Matematika","Ingliz tili","",""],
                "Shanba":     ["Informatika","Tarix","Jismoniy","","",""],
            }
            for day, subjects in subjects_5a.items():
                for i, subj in enumerate(subjects):
                    if subj:
                        db.add(Schedule(class_name="5-A", day=day, lesson_order=i+1, subject=subj))

        db.commit()
    finally:
        db.close()
