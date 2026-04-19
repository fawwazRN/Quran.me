import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Moon,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Haze,
  Map,
  Navigation,
  SunMedium,
  Sparkles,
} from "lucide-react";
import {
  getJadwalHariIni,
  getSemuaProvinsi,
  getKabKota,
  setProvinsi,
  setKabKota,
} from "../features/sholatSlice";

const JadwalSholat = () => {
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const {
    jadwal,
    loading,
    error,
    daftarProvinsi,
    daftarKabKota,
    selectedProvinsi,
    selectedKabKota,
  } = useSelector((state) => state.sholat);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (daftarProvinsi.length === 0) dispatch(getSemuaProvinsi());
  }, [dispatch, daftarProvinsi.length]);

  useEffect(() => {
    if (selectedProvinsi) dispatch(getKabKota(selectedProvinsi));
  }, [dispatch, selectedProvinsi]);

  useEffect(() => {
    if (selectedProvinsi && selectedKabKota) {
      dispatch(
        getJadwalHariIni({
          provinsi: selectedProvinsi,
          kabkota: selectedKabKota,
        }),
      );
    }
  }, [dispatch, selectedProvinsi, selectedKabKota]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-10 min-h-screen transition-colors duration-500">
      <div className="space-y-10 mx-auto max-w-6xl">
        {/* --- NAVIGATION / TOP BAR --- */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-2xl text-white">
              <Navigation size={24} />
            </div>
            <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
              Waktu Sholat
            </h1>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
            {isDark ? <SunMedium size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* --- SELECTION AREA --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-slate-900 shadow-slate-200/50 shadow-xl dark:shadow-none p-6 border border-gray-100 dark:border-slate-800 rounded-[2.5rem]">
          <div className="flex md:flex-row flex-col gap-4 w-full md:w-auto">
            <div className="group relative">
              <Map
                className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-emerald-500 transition-colors -translate-y-1/2"
                size={18}
              />
              <select
                className="bg-gray-50 dark:bg-slate-950 py-4 pr-6 pl-12 border-none rounded-3xl outline-none ring-2 ring-transparent focus:ring-emerald-500/20 w-full md:w-64 font-bold dark:text-white transition-all appearance-none cursor-pointer"
                value={selectedProvinsi}
                onChange={(e) => dispatch(setProvinsi(e.target.value))}>
                <option value="">Pilih Provinsi</option>
                {daftarProvinsi.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="group relative">
              <MapPin
                className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-emerald-500 transition-colors -translate-y-1/2"
                size={18}
              />
              <select
                className="bg-gray-50 dark:bg-slate-950 py-4 pr-6 pl-12 border-none rounded-3xl outline-none ring-2 ring-transparent focus:ring-emerald-500/20 w-full md:w-64 font-bold dark:text-white transition-all appearance-none cursor-pointer"
                value={selectedKabKota}
                onChange={(e) => dispatch(setKabKota(e.target.value))}
                disabled={!selectedProvinsi}>
                <option value="">Pilih Kabupaten/Kota</option>
                {daftarKabKota.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            <Sparkles size={16} />
            <span>Update Otomatis</span>
          </div>
        </motion.div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-slate-900 rounded-4xl h-32 animate-pulse"
                />
              ))}
            </div>
          ) : jadwal ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8">
              {/* HERO CARD */}
              <div className="relative bg-emerald-600 shadow-2xl shadow-emerald-500/40 p-10 rounded-[3rem] overflow-hidden text-white">
                <Clock
                  size={250}
                  className="-top-10 -right-10 absolute opacity-10 rotate-12"
                />
                <div className="z-10 relative flex md:flex-row flex-col justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="bg-emerald-500/50 px-4 py-1.5 border border-emerald-400/30 rounded-full font-black text-xs uppercase tracking-widest">
                      {jadwal.jadwal?.tanggal_lengkap}
                    </span>
                    <h2 className="mt-4 font-black text-5xl md:text-6xl italic uppercase tracking-tighter">
                      {jadwal.kabkota}
                    </h2>
                    <p className="opacity-80 mt-2 font-bold text-emerald-100 text-lg">
                      {jadwal.provinsi}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-200 text-sm uppercase tracking-widest">
                      Hari Ini
                    </p>
                    <p className="font-black text-4xl">{jadwal.jadwal?.hari}</p>
                  </div>
                </div>
              </div>

              {/* GRID JADWAL */}
              <div className="gap-4 md:gap-6 grid grid-cols-2 md:grid-cols-4">
                <TimeCard
                  label="Imsak"
                  time={jadwal.jadwal.imsak}
                  icon={Moon}
                  index={1}
                />
                <TimeCard
                  label="Subuh"
                  time={jadwal.jadwal.subuh}
                  icon={Sunrise}
                  index={2}
                />
                <TimeCard
                  label="Terbit"
                  time={jadwal.jadwal.terbit}
                  icon={Sun}
                  index={3}
                />
                <TimeCard
                  label="Dzuhur"
                  time={jadwal.jadwal.dzuhur}
                  icon={CloudSun}
                  index={4}
                  highlight
                />
                <TimeCard
                  label="Ashar"
                  time={jadwal.jadwal.ashar}
                  icon={Haze}
                  index={5}
                />
                <TimeCard
                  label="Maghrib"
                  time={jadwal.jadwal.maghrib}
                  icon={Sunset}
                  index={6}
                  highlight
                />
                <TimeCard
                  label="Isya"
                  time={jadwal.jadwal.isya}
                  icon={Moon}
                  index={7}
                />
                <TimeCard
                  label="Dhuha"
                  time={jadwal.jadwal.dhuha}
                  icon={SunMedium}
                  index={8}
                />
              </div>
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <div className="flex justify-center items-center bg-emerald-500/10 mx-auto mb-4 rounded-full w-20 h-20">
                <MapPin className="text-emerald-500" size={40} />
              </div>
              <p className="font-bold text-slate-400 italic">
                Silakan pilih lokasi untuk melihat jadwal
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============ SUB-COMPONENT: TIME CARD ============
const TimeCard = ({ label, time, icon: Icon, index, highlight }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`p-6 rounded-[2.5rem] border transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
      highlight
        ? "bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20 scale-105 z-10"
        : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-slate-800 dark:text-white"
    }`}>
    <div
      className={`p-3 rounded-2xl ${highlight ? "bg-white/20" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"}`}>
      <Icon size={24} />
    </div>
    <div className="text-center">
      <p
        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${highlight ? "text-emerald-100" : "text-slate-400"}`}>
        {label}
      </p>
      <p className="font-black text-2xl tracking-tight">{time}</p>
    </div>
  </motion.div>
);

export default JadwalSholat;
