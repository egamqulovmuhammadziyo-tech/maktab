import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiAcademicCap, HiNewspaper, HiSpeakerphone, HiMail, HiStar, HiPhotograph } from 'react-icons/hi';
import { teachersApi, newsApi, announcementsApi, contactApi, achievementsApi, galleryApi } from '../../api';
import { Link } from 'react-router-dom';

interface Stats {
  teachers: number;
  news: number;
  announcements: number;
  contacts: number;
  achievements: number;
  gallery: number;
  unreadContacts: number;
}

const statCards = [
  { key: 'teachers', label: "O'qituvchilar", icon: HiAcademicCap, color: 'from-violet-500 to-purple-600', link: '/admin/teachers' },
  { key: 'news', label: 'Yangiliklar', icon: HiNewspaper, color: 'from-blue-500 to-cyan-500', link: '/admin/news' },
  { key: 'announcements', label: "E'lonlar", icon: HiSpeakerphone, color: 'from-amber-400 to-orange-500', link: '/admin/announcements' },
  { key: 'contacts', label: 'Xabarlar', icon: HiMail, color: 'from-rose-400 to-pink-500', link: '/admin/contacts', badge: 'unreadContacts' },
  { key: 'achievements', label: 'Yutuqlar', icon: HiStar, color: 'from-emerald-400 to-teal-500', link: '/admin/achievements' },
  { key: 'gallery', label: 'Galereya', icon: HiPhotograph, color: 'from-indigo-400 to-blue-500', link: '/admin/gallery' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ teachers: 0, news: 0, announcements: 0, contacts: 0, achievements: 0, gallery: 0, unreadContacts: 0 });

  useEffect(() => {
    Promise.allSettled([
      teachersApi.getAllAdmin(),
      newsApi.getAllAdmin(),
      announcementsApi.getAllAdmin(),
      contactApi.getAll(),
      achievementsApi.getAll(),
      galleryApi.getAll(),
    ]).then(([t, n, a, c, ac, g]) => {
      const contacts = c.status === 'fulfilled' ? c.value.data : [];
      setStats({
        teachers: t.status === 'fulfilled' ? t.value.data.length : 0,
        news: n.status === 'fulfilled' ? n.value.data.length : 0,
        announcements: a.status === 'fulfilled' ? a.value.data.length : 0,
        contacts: contacts.length,
        achievements: ac.status === 'fulfilled' ? (ac.value.data as any[]).length : 0,
        gallery: g.status === 'fulfilled' ? (g.value.data as any[]).length : 0,
        unreadContacts: contacts.filter((c: { is_read: boolean }) => !c.is_read).length,
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">17-Maktab boshqaruv paneli</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, color, link, badge }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <Link
              to={link}
              className="block bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 overflow-hidden relative"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <p className="font-heading font-bold text-4xl text-slate-900 mt-1">
                    {stats[key as keyof Stats]}
                  </p>
                  {badge && (stats[badge as keyof Stats] as number) > 0 && (
                    <span className="badge badge-error badge-sm mt-2">
                      {stats[badge as keyof Stats]} o'qilmagan
                    </span>
                  )}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick info */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-slate-800 mb-4">Tezkor havolalar</h2>
          <div className="space-y-2">
            {[
              { to: '/admin/teachers', label: "Yangi o'qituvchi qo'shish" },
              { to: '/admin/news', label: 'Yangilik yozish' },
              { to: '/admin/announcements', label: "E'lon qo'shish" },
              { to: '/admin/schedule', label: 'Dars jadvalini tahrirlash' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="flex items-center gap-2 p-3 rounded-2xl hover:bg-brand-50 hover:text-brand-600 transition text-slate-600 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl p-6 text-white">
          <h2 className="font-heading font-bold text-lg mb-2">17-Maktab</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Farg'ona viloyati Beshariq tumani Sobirtepa qishlog'i. Zamonaviy ta'lim va yuqori sifatli bilim berish.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="font-bold text-2xl">1200+</p>
              <p className="text-xs text-white/70 mt-0.5">O'quvchi</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="font-bold text-2xl">68</p>
              <p className="text-xs text-white/70 mt-0.5">O'qituvchi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
