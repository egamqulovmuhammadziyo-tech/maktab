import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { settingsApi } from "../../api";
import { useCountUp } from "../../lib/useCountUp";

function HeroStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const display = useCountUp(value, 1500, true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="font-heading font-black text-3xl sm:text-4xl text-white tabular-nums">
        {display}
      </div>
      <div className="text-white/50 text-sm mt-1 font-medium">{label}</div>
    </motion.div>
  );
}

type Settings = Record<string, string>;

export default function HeroSection() {
  const [s, setS] = useState<Settings>({
    hero_title: "Bilim va Kelajak",
    hero_subtitle: "Zamonaviy ta'lim, innovatsion yondashuv, yorqin kelajak",
    school_name: "17-MAKTAB",
    students_count: "1200+",
    teachers_count: "68",
    experience_years: "20+",
  });

  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => setS(r.data))
      .catch(() => {});
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {s.school_name} — Rasmiy Sayt
            </span>

            <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
              {s.hero_title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                Boshlaydi Bu Yerda
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              {s.hero_subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="btn rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white border-0 shadow-xl shadow-brand-500/30 hover:-translate-y-1 transition-transform px-8 h-12 text-base font-bold"
              >
                Maktab haqida
              </Link>
              <Link
                to="/contact"
                className="btn rounded-2xl bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all px-8 h-12 text-base font-bold"
              >
                Bog'lanish
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6">
            {[
              { value: s.students_count, label: "O'quvchi" },
              { value: s.teachers_count, label: "O'qituvchi" },
              { value: s.experience_years, label: "Yillik tajriba" },
            ].map((stat, i) => (
              <HeroStat key={stat.label} value={stat.value} label={stat.label} delay={0.3 + i * 0.1} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        to="/stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </Link>
    </section>
  );
}
