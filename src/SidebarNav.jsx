import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Sparkles,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className="block w-full no-underline">
    <motion.div
      whileHover={{
        x: 6,
        backgroundColor: "rgba(5, 150, 105, 0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between px-6 py-4 rounded-[2rem] transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] font-black border border-emerald-400/30"
          : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold"
      }`}>
      <div className="flex items-center gap-4">
        {/* Warna Icon disesuaikan agar selalu tajam */}
        <Icon
          size={22}
          strokeWidth={active ? 3 : 2.5}
          className={active ? "text-white" : "text-emerald-600"}
        />
        <span
          className={`text-[13px] uppercase tracking-wide ${active ? "opacity-100" : "opacity-90"}`}>
          {label}
        </span>
      </div>

      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ChevronRight size={18} className="text-white/70" />
        </motion.div>
      )}
    </motion.div>
  </Link>
);

const SidebarNav = () => {
  const location = useLocation();

  return (
    <aside className="hidden top-0 left-0 z-[100] fixed lg:flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-8 border-slate-200/50 dark:border-slate-800/50 border-r w-80 h-screen">
      {/* BRANDING SECTION */}
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="flex justify-center items-center bg-emerald-700 shadow-2xl shadow-emerald-600/40 rounded-[1.2rem] w-12 h-12 text-white">
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-black text-slate-900 dark:text-white text-2xl leading-none tracking-tighter">
            QURAN.ME
            <span className="ml-1 text-[10px] text-emerald-600 align-top">
              V2
            </span>
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck size={10} className="text-emerald-500" />
            <p className="font-black text-[9px] text-slate-400 uppercase tracking-[0.2em]">
              Digital Companion
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <div className="flex flex-col gap-4">
        <p className="mb-2 px-6 font-black text-[10px] text-slate-400/80 uppercase tracking-[0.5em]">
          Main Console
        </p>

        <NavItem
          to="/"
          icon={BookOpen}
          label="Al-Qur'an"
          active={
            location.pathname === "/" || location.pathname.includes("/surat")
          }
        />

        <NavItem
          to="/sholat"
          icon={Clock}
          label="Jadwal Sholat"
          active={location.pathname === "/sholat"}
        />
      </div>

      <div className="flex-grow" />

      {/* PREMIUM INFO CARD */}
      <div className="group relative bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 rounded-[2.8rem] overflow-hidden text-white">
        {/* Background Decorative Pattern */}
        <LayoutGrid
          className="-right-8 -bottom-8 absolute opacity-20 text-emerald-500 rotate-12 group-hover:scale-125 transition-transform duration-700"
          size={140}
        />

        <div className="z-10 relative">
          <div className="flex justify-center items-center bg-emerald-500/10 shadow-inner mb-6 border border-emerald-500/20 rounded-2xl w-11 h-11 text-emerald-400">
            <Sparkles size={20} />
          </div>
          <h4 className="font-black text-sm uppercase leading-tight tracking-widest">
            Dashboard
            <br />
            <span className="text-emerald-400 text-xs">Aplikasi Ibadah</span>
          </h4>
          <p className="opacity-80 mt-4 pl-3 border-emerald-600 border-l-2 font-medium text-[11px] text-slate-400 italic leading-relaxed">
            "Sempurnakan ibadahmu dengan teknologi tepat guna."
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
