import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment"; // Import moment
import "moment/locale/id"; // Locale Indonesia
import {
  Video,
  Moon,
  Sun,
  Calendar,
  Clock,
  Users,
  Radio,
  ExternalLink,
  PlayCircle,
  Mic2,
  VideoOff,
} from "lucide-react";

// ================= DATA KAJIAN =================
// Kita gunakan format tanggal/waktu yang mudah dibaca moment
// Untuk demo LIVE, saya buat event pertama secara dinamis relatid terhadap waktu 'sekarang'
const now = moment();

const meetData = [
  {
    id: 1,
    title: "Kajian Rutin Subuh: Tafsir Juz Amma",
    speaker: "Ustadz Abdul Somad, Lc., MA",
    description:
      "Kajian singkat setiap pagi membahas tafsir surat-surat pendek.",

    // === LOGIC DEMO LIVE ===
    // Kita set mulai 10 menit lalu, selesai 50 menit dari sekarang (Durasi 1 jam)
    // Supaya saat Anda buka halaman ini, statusnya PASTI LIVE
    start_time: moment().subtract(10, "minutes").format(),
    end_time: moment().add(50, "minutes").format(),

    platform: "Zoom",
    link: "https://zoom.us/j/123456789",
    attendees: 1245,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Sirah Nabawiyah: Perjalanan Rasulullah",
    speaker: "Ustadz Hanan Attaki",
    description: "Mengupas sejarah kehidupan Rasulullah SAW yang penuh hikmah.",

    // Event mendatang (Contoh: 2 hari lagi)
    start_time: moment().add(2, "days").hour(19).minute(30).format(),
    end_time: moment().add(2, "days").hour(21).minute(0).format(),

    platform: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
    attendees: 890,
    image:
      "https://images.unsplash.com/photo-1605092676920-7ac2ae1dbe2d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Parenting Islami: Mendidik Anak Generasi Quran",
    speaker: "Ummi Iriani",
    description: "Tips dan trik mendidik anak agar dekat dengan Al-Quran.",

    // Event mendatang (Besok pagi)
    start_time: moment().add(1, "days").hour(9).minute(0).format(),
    end_time: moment().add(1, "days").hour(11).minute(0).format(),

    platform: "Zoom",
    link: "#",
    attendees: 320,
    image:
      "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Tanya Jawab Fiqih Kontemporer",
    speaker: "Dr. Firanda Abirawa, MA",
    description: "Sesi tanya jawab seputar masalah fiqih modern.",

    // Event selesai (Kemarin)
    start_time: moment().subtract(1, "days").hour(20).minute(0).format(),
    end_time: moment().subtract(1, "days").hour(21).minute(30).format(),

    platform: "YouTube Live",
    link: "https://youtube.com",
    attendees: 5600,
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop",
  },
];

const Meet = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [activeTab, setActiveTab] = useState("semua");
  const [currentTime, setCurrentTime] = useState(moment()); // State untuk memaksa re-render

  // Update waktu setiap 30 detik untuk update status LIVE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 30000); // Cek setiap 30 detik

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // === LOGIC OTOMATIS ===
  const processedMeets = meetData.map((meet) => {
    const start = moment(meet.start_time);
    const end = moment(meet.end_time);

    let status = "UPCOMING";
    if (currentTime.isBetween(start, end)) {
      status = "LIVE";
    } else if (currentTime.isAfter(end)) {
      status = "FINISHED";
    }

    return {
      ...meet,
      status,
      formattedDate: start.format("dddd, DD MMMM YYYY"),
      formattedTime: `${start.format("HH:mm")} - ${end.format("HH:mm")} WIB`,
    };
  });

  // Filter
  const filteredMeets = processedMeets.filter((meet) => {
    if (activeTab === "semua") return true;
    if (activeTab === "live") return meet.status === "LIVE";
    if (activeTab === "upcoming") return meet.status === "UPCOMING";
    return true;
  });

  // Cek Live Event
  const liveEvent = processedMeets.find((m) => m.status === "LIVE");

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-10 min-h-screen transition-colors duration-500">
      <div className="space-y-8 mx-auto max-w-6xl">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-2xl text-white">
              <Video size={24} />
            </div>
            <div>
              <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
                Islamic Meet
              </h1>
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Kajian & Event Online
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* --- LIVE NOW HERO CARD --- */}
        {/* Muncul otomatis jika ada status LIVE */}
        <AnimatePresence>
          {liveEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gradient-to-br from-red-600 to-rose-700 shadow-2xl shadow-red-500/30 p-8 rounded-[2.5rem] overflow-hidden text-white">
              <div className="top-0 right-0 absolute bg-white/10 blur-3xl -mt-20 -mr-20 rounded-full w-64 h-64" />

              <div className="z-10 relative flex md:flex-row flex-col justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex w-3 h-3">
                      <span className="inline-flex absolute bg-white opacity-75 rounded-full w-full h-full animate-ping"></span>
                      <span className="inline-flex relative bg-white rounded-full w-3 h-3"></span>
                    </span>
                    <span className="font-black text-xs uppercase tracking-widest">
                      LIVE SEKARANG
                    </span>
                  </div>

                  <h2 className="mb-2 font-black text-2xl md:text-3xl leading-tight">
                    {liveEvent.title}
                  </h2>
                  <p className="mb-4 font-bold text-white/80">
                    {liveEvent.speaker}
                  </p>

                  <div className="flex items-center gap-4 font-medium text-white/70 text-xs">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {liveEvent.attendees} Peserta
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {liveEvent.formattedTime}
                    </span>
                  </div>
                </div>

                <a
                  href={liveEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white shadow-lg px-8 py-4 rounded-2xl font-black text-red-600 text-sm hover:scale-105 transition-all">
                  <PlayCircle size={20} />
                  Gabung Sekarang
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- TABS --- */}
        <div className="flex md:flex-row flex-col justify-between items-center gap-4">
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 border border-gray-100 dark:border-slate-800 rounded-3xl">
            {[
              { id: "semua", label: "Semua", icon: Calendar },
              { id: "live", label: "Live", icon: Radio },
              { id: "upcoming", label: "Akan Datang", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="font-bold text-[10px] text-slate-400">
            Waktu Server: {currentTime.format("HH:mm:ss")}
          </div>
        </div>

        {/* --- EVENT LIST --- */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredMeets.length > 0 ? (
              filteredMeets.map((meet, index) => (
                <motion.div
                  key={meet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-6 border border-gray-100 dark:border-slate-800 rounded-[2rem] transition-all">
                  <div className="flex md:flex-row flex-col justify-between items-start gap-6">
                    {/* Info Utama */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {meet.status === "LIVE" && (
                          <span className="flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-full font-bold text-[10px] text-red-600 animate-pulse">
                            <Radio size={10} /> LIVE
                          </span>
                        )}
                        {meet.status === "UPCOMING" && (
                          <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full font-bold text-[10px] text-blue-600 dark:text-blue-400">
                            {meet.formattedDate}
                          </span>
                        )}
                        {meet.status === "FINISHED" && (
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-[10px] text-slate-400">
                            Selesai
                          </span>
                        )}
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-[10px] text-slate-500 dark:text-slate-400">
                          {meet.platform === "Zoom" ? (
                            <Video size={10} />
                          ) : (
                            <Mic2 size={10} />
                          )}{" "}
                          {meet.platform}
                        </span>
                      </div>

                      <h3 className="mb-1 font-black text-slate-800 dark:text-white group-hover:text-emerald-600 text-lg transition-colors">
                        {meet.title}
                      </h3>
                      <p className="mb-3 font-medium text-slate-500 dark:text-slate-400 text-sm">
                        {meet.speaker}
                      </p>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {meet.description}
                      </p>
                    </div>

                    {/* Info Samping & Action */}
                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 w-full md:w-auto">
                      <div className="text-left md:text-right">
                        <p className="font-black text-slate-800 dark:text-white">
                          {meet.formattedTime}
                        </p>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Users size={12} />
                          {meet.attendees} pendaftar
                        </div>
                      </div>

                      {meet.status !== "FINISHED" ? (
                        <a
                          href={meet.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                            meet.status === "LIVE"
                              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                          }`}>
                          <ExternalLink size={16} />
                          {meet.status === "LIVE" ? "Gabung" : "Set Alarm"}
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl font-bold text-slate-300 dark:text-slate-600 text-sm cursor-not-allowed">
                          <VideoOff size={16} /> Replay
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center">
                <Video
                  size={48}
                  className="mx-auto mb-4 text-slate-200 dark:text-slate-700"
                />
                <p className="font-bold text-slate-500">Tidak ada event</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Meet;
