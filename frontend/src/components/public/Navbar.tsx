import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiMoon, HiSun } from "react-icons/hi";
import { settingsApi } from "../../api";

const NAV_LINKS = [
  { to: "/", label: "Bosh sahifa", hash: "" },
  { to: "/about", label: "Maktab haqida", hash: "" },
  { to: "/teachers", label: "O'qituvchilar", hash: "" },
  { to: "/news", label: "Yangiliklar", hash: "" },
  { to: "/announcements", label: "E'lonlar", hash: "" },
  { to: "/gallery", label: "Galereya", hash: "" },
  { to: "/contact", label: "Aloqa", hash: "" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [schoolName, setSchoolName] = useState("17-MAKTAB");
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    settingsApi.getAll().then((r: { data: Record<string, string> }) =>
      setSchoolName(r.data.school_name || "17-MAKTAB")
    ).catch(() => {});
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "school");
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const goContact = () => {
    setOpen(false);
    if (location.pathname === "/contact") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/contact");
    }
  };

  const isHome = location.pathname === "/";
  const isTransparent = !scrolled && isHome;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/95 backdrop-blur-xl shadow-lg border-b border-base-300"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 lg:h-[70px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0">
            <span className="text-white font-heading font-black text-xs">17</span>
          </div>
          <div>
            <p className={`font-heading font-black text-sm leading-none ${isTransparent ? "text-white" : "text-base-content"}`}>
              {schoolName}
            </p>
            <p className={`text-[9px] font-semibold tracking-widest uppercase ${isTransparent ? "text-white/60" : "text-brand-500"}`}>
              O'rta Ta'lim
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-brand-50 text-brand-600"
                  : isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-base-content/70 hover:text-brand-600 hover:bg-brand-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleDark}
            className={`p-2 rounded-xl transition-all ${
              isTransparent ? "text-white/60 hover:bg-white/10" : "text-base-content/50 hover:bg-base-200"
            }`}
            aria-label="Dark mode"
          >
            {isDark
              ? <HiSun className="w-5 h-5 text-amber-400" />
              : <HiMoon className="w-5 h-5" />
            }
          </button>
          <button
            onClick={goContact}
            className="btn btn-sm rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-lg shadow-brand-500/30 hover:-translate-y-0.5 transition-all font-bold px-5"
          >
            Bog'lanish
          </button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-1">
          <button onClick={toggleDark} className={`p-2 rounded-xl ${isTransparent ? "text-white/60" : "text-base-content/50"}`}>
            {isDark ? <HiSun className="w-5 h-5 text-amber-400" /> : <HiMoon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className={`p-2 rounded-xl ${isTransparent ? "text-white" : "text-base-content"}`}
            aria-label="Menu"
          >
            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden bg-base-100 border-t border-base-300 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`flex w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors text-sm ${
                    location.pathname === link.to
                      ? "bg-brand-50 text-brand-600"
                      : "text-base-content hover:bg-brand-50 hover:text-brand-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <button
                  onClick={goContact}
                  className="w-full btn rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 font-bold"
                >
                  Bog'lanish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
