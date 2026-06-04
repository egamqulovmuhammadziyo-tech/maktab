import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiNewspaper, HiSpeakerphone, HiAcademicCap,
  HiPhotograph, HiMail, HiCalendar, HiStar, HiUsers,
  HiLogout, HiMenu, HiX, HiCog, HiExternalLink
} from 'react-icons/hi';
import { useAuthStore } from '../../store/auth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: HiHome, end: true },
  { to: '/admin/teachers', label: "O'qituvchilar", icon: HiAcademicCap },
  { to: '/admin/news', label: 'Yangiliklar', icon: HiNewspaper },
  { to: '/admin/announcements', label: "E'lonlar", icon: HiSpeakerphone },
  { to: '/admin/contacts', label: 'Xabarlar', icon: HiMail },
  { to: '/admin/schedule', label: 'Jadval', icon: HiCalendar },
  { to: '/admin/achievements', label: 'Yutuqlar', icon: HiStar },
  { to: '/admin/gallery', label: 'Galereya', icon: HiPhotograph },
  { to: '/admin/users', label: 'Foydalanuvchilar', icon: HiUsers },
  { to: '/admin/settings', label: 'Sozlamalar', icon: HiCog },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <motion.aside
        animate={{ width: open ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0 bg-slate-900 text-white flex flex-col overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center font-heading font-black text-sm">17</div>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <p className="font-heading font-bold text-sm text-white leading-tight">17-MAKTAB</p>
                <p className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {open && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-semibold truncate">
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {/* Saytni ko'rish */}
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <HiExternalLink className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {open && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-semibold">
                  Saytni ko'rish
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </nav>

        <div className="border-t border-white/10 p-3">
          {open && user && (
            <div className="mb-3 px-2 py-2 rounded-xl bg-white/5">
              <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
            <HiLogout className="w-5 h-5 flex-shrink-0" />
            {open && <span className="text-sm font-semibold">Chiqish</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 flex items-center gap-4 px-6 py-4 flex-shrink-0">
          <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm btn-square rounded-xl">
            {open ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" target="_blank" className="btn btn-ghost btn-sm rounded-xl gap-2 text-slate-600">
              <HiExternalLink className="w-4 h-4" /> Saytni ko'rish
            </Link>
            {user && (
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-brand-500 to-accent-500 text-white rounded-full w-9">
                  <span className="text-sm font-bold">{user.full_name[0]}</span>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
