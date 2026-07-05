import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useCountUp } from "../../lib/useCountUp";
import {
  teachersApi,
  newsApi,
  announcementsApi,
  achievementsApi,
  galleryApi,
  contactApi,
  settingsApi,
} from "../../api";
import type {
  Teacher,
  News,
  Announcement,
  Achievement,
  GalleryImage,
} from "../../types";

// ── STATS ─────────────────────────────────────────────────────────────────────
function StatCard({
  stat,
  index,
}: {
  stat: { value: string; label: string; icon: string; color: string };
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const display = useCountUp(stat.value, 1400, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-base-300 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-2xl shadow-lg mb-4`}
      >
        {stat.icon}
      </div>
      <div className="font-heading font-black text-4xl text-base-content tabular-nums">
        {display}
      </div>
      <div className="text-base-content/60 font-medium mt-1">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const [s, setS] = useState<Record<string, string>>({});
  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => setS(r.data))
      .catch(() => {});
  }, []);

  const stats = [
    {
      value: s.students_count || "1200+",
      label: "O'quvchilar",
      icon: "👨‍🎓",
      color: "from-violet-500 to-purple-600",
    },
    {
      value: s.teachers_count || "68",
      label: "O'qituvchilar",
      icon: "👩‍🏫",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: s.experience_years || "20+",
      label: "Yillik tajriba",
      icon: "🏆",
      color: "from-amber-400 to-orange-500",
    },
    {
      value: s.subjects_count || "45",
      label: "Fan yo'nalishlari",
      icon: "📘",
      color: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <section id="stats" className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
export function AboutSection() {
  const [s, setS] = useState<Record<string, string>>({});
  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => setS(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
              🏫 Maktab haqida
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content mb-6">
              {s.school_name || "17-Maktab"} —
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
                {" "}
                zamonaviy ta'lim
              </span>
            </h2>
            <p className="text-lg text-base-content/70 leading-relaxed mb-8">
              {s.school_description ||
                "Farg'ona viloyati Beshariq tumanida zamonaviy ta'lim beruvchi maktab."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🎓",
                  title: "Tajribali o'qituvchilar",
                  desc: "Professional pedagogik metodlar",
                },
                {
                  icon: "💡",
                  title: "Zamonaviy usullar",
                  desc: "Innovatsion ta'lim yondashuvi",
                },
                {
                  icon: "🏆",
                  title: "Yuqori natijalar",
                  desc: "Olimpiada va tanlov g'oliblari",
                },
                {
                  icon: "🌍",
                  title: "Xalqaro standart",
                  desc: "ISO sertifikatlangan maktab",
                },
              ].map((item) => (
                <div key={item.title} className="bg-base-200 rounded-2xl p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-bold text-base-content text-sm">
                    {item.title}
                  </div>
                  <div className="text-base-content/60 text-xs mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl p-8 text-white">
              <h3 className="font-heading font-bold text-2xl mb-6">
                Ish vaqtimiz
              </h3>
              {[
                { day: "Dushanba — Juma", time: "08:00 — 18:00" },
                { day: "Shanba", time: "08:00 — 13:00" },
                { day: "Yakshanba", time: "Dam olish" },
              ].map((row) => (
                <div
                  key={row.day}
                  className="flex justify-between items-center py-3 border-b border-white/20 last:border-0"
                >
                  <span className="text-white/80 font-medium">{row.day}</span>
                  <span
                    className={`font-bold ${row.time === "Dam olish" ? "text-white/40" : "text-white"}`}
                  >
                    {row.time}
                  </span>
                </div>
              ))}
              <Link
                to="/contact"
                className="mt-6 w-full btn rounded-2xl bg-white text-brand-600 border-0 font-bold hover:-translate-y-0.5 transition-transform"
              >
                Bog'lanish →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── TEACHERS ──────────────────────────────────────────────────────────────────
export function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  useEffect(() => {
    teachersApi
      .getAll()
      .then((r) => setTeachers(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="teachers" className="py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
            👩‍🏫 O'qituvchilar
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content">
            Tajribali{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
              pedagoglar
            </span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-base-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <img
                  src={t.image_url || `https://i.pravatar.cc/80?u=${t.id}`}
                  alt={t.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100"
                />
                <div>
                  <h3 className="font-bold text-base-content">{t.name}</h3>
                  <p className="text-brand-600 text-sm font-semibold">
                    {t.subject}
                  </p>
                  {t.experience && (
                    <p className="text-base-content/50 text-xs mt-0.5">
                      {t.experience}
                    </p>
                  )}
                </div>
              </div>
              {t.bio && (
                <p className="text-base-content/60 text-sm mt-4 leading-relaxed">
                  {t.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── NEWS ──────────────────────────────────────────────────────────────────────
export function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  useEffect(() => {
    newsApi
      .getAll()
      .then((r) => setNews(r.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  const tagColors: Record<string, string> = {
    Yutuq: "bg-violet-100 text-violet-700",
    Yangilik: "bg-blue-100 text-blue-700",
    "Ta'lim": "bg-emerald-100 text-emerald-700",
    Tadbirlar: "bg-amber-100 text-amber-700",
  };

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
            📰 Yangiliklar
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content">
            So'nggi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
              yangiliklar
            </span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-base-300 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {n.image_url && (
                <img
                  src={n.image_url}
                  alt={n.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${tagColors[n.tag] || "bg-base-200 text-base-content/70"}`}
                >
                  {n.tag}
                </span>
                <h3 className="font-heading font-bold text-lg text-base-content mt-3 mb-2">
                  {n.title}
                </h3>
                {n.excerpt && (
                  <p className="text-base-content/60 text-sm leading-relaxed">
                    {n.excerpt}
                  </p>
                )}
                <p className="text-xs text-base-content/50 mt-4">
                  {new Date(n.created_at).toLocaleDateString("uz-UZ")}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
export function AnnouncementsSection() {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => {
    announcementsApi
      .getAll()
      .then((r) => setItems(r.data))
      .catch(() => {});
  }, []);

  const typeColors: Record<string, string> = {
    urgent: "border-l-red-500 bg-red-50",
    info: "border-l-blue-500 bg-blue-50",
    event: "border-l-amber-500 bg-amber-50",
  };

  return (
    <section id="announcements" className="py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
            📢 E'lonlar
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content">
            Muhim{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
              e'lonlar
            </span>
          </h2>
        </div>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {items.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border-l-4 p-5 ${typeColors[a.type] || "border-l-slate-400 bg-white"}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-base-content">{a.title}</h3>
                    {a.event_date && (
                      <span className="text-xs font-semibold text-base-content/60 bg-white px-3 py-1 rounded-full border border-base-300">
                        {a.event_date}
                      </span>
                    )}
                  </div>
                  <p className="text-base-content/70 text-sm mt-1">{a.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────
export function AchievementsSection() {
  const [items, setItems] = useState<Achievement[]>([]);
  useEffect(() => {
    achievementsApi
      .getAll()
      .then((r) => setItems(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="achievements" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
            🏆 Yutuqlar
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content">
            Bizning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
              yutuqlarimiz
            </span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 border border-base-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="text-5xl mb-4">{a.icon}</div>
              <div className="font-heading font-bold text-xl text-base-content mb-2">
                {a.title}
              </div>
              {a.description && (
                <p className="text-base-content/60 text-sm">{a.description}</p>
              )}
              {a.year && (
                <span className="inline-block mt-3 bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1 rounded-full">
                  {a.year}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useEffect(() => {
    galleryApi
      .getAll()
      .then((r) => setImages(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
            🖼️ Galereya
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content">
            Maktab{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
              galereyasi
            </span>
          </h2>
        </div>

        {/* Masonry: CSS columns bilan tabiiy balandlikdagi rasmlar */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:balance]">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05 }}
              onClick={() => setActiveIndex(i)}
              className="relative mb-4 rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid"
            >
              <img
                src={img.image_url}
                alt={img.title || ""}
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                {img.title && (
                  <span className="text-white text-sm font-semibold drop-shadow">{img.title}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActiveIndex(null)}
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Yopish"
            >
              <HiX className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Oldingi"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Keyingi"
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={images[activeIndex].image_url}
              alt={images[activeIndex].title || ""}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />
            {images[activeIndex].title && (
              <p className="absolute bottom-6 text-white/80 text-sm font-medium">
                {images[activeIndex].title}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
export function ContactSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.send(form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-bold px-4 py-2 rounded-full mb-4">
            📞 Aloqa
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-base-content">
            Biz bilan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
              bog'laning
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: "📍", label: "Manzil", value: settings.address },
              { icon: "📞", label: "Telefon", value: settings.phone },
              { icon: "✉️", label: "Email", value: settings.email },
            ].map(
              (item) =>
                item.value && (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-5 bg-base-200 rounded-2xl"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-base-content/60">
                        {item.label}
                      </p>
                      <p className="font-bold text-base-content mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ),
            )}

            {/* Map */}
            {settings.map_embed && (
              <div className="rounded-2xl overflow-hidden h-48 shadow-sm border border-base-300">
                <iframe
                  src={settings.map_embed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-base-200 rounded-3xl p-6">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-heading font-bold text-xl text-base-content">
                  Xabar yuborildi!
                </h3>
                <p className="text-base-content/60 mt-2">
                  Tez orada siz bilan bog'lanamiz.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn rounded-2xl mt-6 bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0"
                >
                  Yana xabar yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-bold text-xl text-base-content mb-5">
                  Xabar yuborish
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                      placeholder="Ismingiz *"
                      className="input input-bordered rounded-2xl w-full bg-white"
                    />
                  </div>
                  <div className="form-control">
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      type="email"
                      placeholder="Email *"
                      className="input input-bordered rounded-2xl w-full bg-white"
                    />
                  </div>
                </div>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Telefon"
                  className="input input-bordered rounded-2xl w-full bg-white"
                />
                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Mavzu"
                  className="input input-bordered rounded-2xl w-full bg-white"
                />
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  placeholder="Xabaringiz *"
                  rows={4}
                  className="textarea textarea-bordered rounded-2xl w-full bg-white resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg h-12 font-bold"
                >
                  {loading ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    "Yuborish →"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
export function Footer() {
  const [s, setS] = useState<Record<string, string>>({});
  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => setS(r.data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-neutral text-neutral-content py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-heading font-black text-sm">
                  17
                </span>
              </div>
              <div>
                <p className="font-heading font-black text-white">
                  {s.school_name || "17-MAKTAB"}
                </p>
                <p className="text-white/50 text-xs">
                  {s.school_subtitle || "Umumiy O'rta Ta'lim"}
                </p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              {s.school_description}
            </p>
            <div className="flex gap-3 mt-5">
              {s.facebook && (
                <a
                  href={s.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-500 transition-colors flex items-center justify-center text-sm"
                >
                  f
                </a>
              )}
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-500 transition-colors flex items-center justify-center text-sm"
                >
                  ig
                </a>
              )}
              {s.telegram && (
                <a
                  href={s.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-500 transition-colors flex items-center justify-center text-sm"
                >
                  tg
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Sahifalar
            </h4>
            <div className="space-y-2">
              {[
                ["/", "Bosh sahifa"],
                ["/about", "Maktab haqida"],
                ["/teachers", "O'qituvchilar"],
                ["/news", "Yangiliklar"],
                ["/contact", "Aloqa"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  to={href}
                  className="block text-white/50 hover:text-white text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4">Aloqa</h4>
            <div className="space-y-3 text-sm text-white/50">
              {s.address && <p>📍 {s.address}</p>}
              {s.phone && <p>📞 {s.phone}</p>}
              {s.email && <p>✉️ {s.email}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 mt-10 text-xs text-white/40">
          <p>© 2026 17-maktab. Barcha huquqlar himoyalangan.</p>

          {/* Admin panelga olib o'tuvchi chiroyli kichik tugma */}
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-200"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
