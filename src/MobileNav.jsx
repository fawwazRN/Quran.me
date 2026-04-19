import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Clock, LayoutGrid } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-6 left-1/2 z-50 fixed w-[90%] max-w-md -translate-x-1/2">
      <div className="flex justify-around items-center bg-slate-900/80 dark:bg-slate-800/90 shadow-2xl backdrop-blur-xl px-8 py-4 border border-white/10 rounded-[2rem]">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${isActive("/") ? "text-emerald-400" : "text-slate-400"}`}>
          <BookOpen size={20} strokeWidth={isActive("/") ? 3 : 2} />
          <span className="font-black text-[10px] uppercase tracking-tighter">
            Quran
          </span>
        </Link>

        <Link
          to="/sholat"
          className={`flex flex-col items-center gap-1 ${isActive("/sholat") ? "text-emerald-400" : "text-slate-400"}`}>
          <Clock size={20} strokeWidth={isActive("/sholat") ? 3 : 2} />
          <span className="font-black text-[10px] uppercase tracking-tighter">
            Sholat
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
