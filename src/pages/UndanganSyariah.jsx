import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Crown,
  Star,
  Check,
  X,
  Moon,
  Sun,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Mail,
} from "lucide-react";

// ================= DATA PAKET =================
const paketData = [
  {
    id: 1,
    name: "Standar Edition",
    price: "200.000",
    icon: Gift,
    color: "from-slate-500 to-slate-600",
    border: "border-slate-200 dark:border-slate-700",
    bgColor: "bg-white dark:bg-slate-900",
    textcolor: "text-slate-800 dark:text-white",
    badge: null,
    features: [
      { text: "Desain Responsif (HP & PC)", available: true },
      { text: "Tema Pilihan (5 Tema)", available: true },
      { text: "Musik Latar Autoplay", available: true },
      { text: "Countdown Timer", available: true },
      { text: "Fitur RSVP Dasar", available: true },
      { text: "Galeri Foto (Max 5)", available: true },
      { text: "Domain acak (.netlify.app)", available: true },
      { text: "Revisi Minor", available: true },
      { text: "Galeri Video", available: false },
      { text: "Custom Domain", available: false },
      { text: "Fitur Love Story", available: false },
    ],
    waMessage:
      "Halo Admin, saya tertarik dengan paket *Standar Edition* (Rp 200.000) untuk undangan pernikahan.",
  },
  {
    id: 2,
    name: "Premium Edition",
    price: "700.000",
    icon: Star,
    color: "from-emerald-500 to-teal-600",
    border: "border-emerald-500 dark:border-emerald-400",
    bgColor: "bg-white dark:bg-slate-900",
    textcolor: "text-slate-800 dark:text-white",
    badge: "Best Seller",
    features: [
      { text: "Semua Fitur Standar", available: true },
      { text: "Galeri Video (1 Video)", available: true },
      { text: "Fitur Love Story", available: true },
      { text: "Google Maps Lokasi", available: true },
      { text: "Galeri Foto (Max 15)", available: true },
      { text: "Custom Subdomain", available: true },
      { text: "Revisi 2x", available: true },
      { text: "Support Prioritas", available: true },
      { text: "Domain Premium (.com)", available: false },
      { text: "Fitur Live Streaming", available: false },
    ],
    waMessage:
      "Halo Admin, saya tertarik dengan paket *Premium Edition* (Rp 700.000) untuk undangan pernikahan.",
  },
  {
    id: 3,
    name: "Max Edition",
    price: "1.000.000",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    border: "border-amber-400 dark:border-amber-500",
    bgColor: "bg-slate-900 dark:bg-slate-950",
    textcolor: "text-white",
    badge: "Rekomendasi",
    features: [
      { text: "Semua Fitur Premium", available: true },
      { text: "Domain Premium (.com/.id)", available: true },
      { text: "Fitur Live Streaming", available: true },
      { text: "Galeri Unlimited", available: true },
      { text: "Music Request", available: true },
      { text: "Revisi Unlimited", available: true },
      { text: "Desain Eksklusif", available: true },
      { text: "Amplop Digital", available: true },
      { text: "Kirim Ke 100 Tamu (Broadcast)", available: true },
      { text: "Support 24/7", available: true },
    ],
    waMessage:
      "Halo Admin, saya tertarik dengan paket *Max Edition* (Rp 1.000.000) untuk undangan pernikahan.",
  },
];

// GANTI DENGAN NOMOR WHATSAPP ANDA (Format: 62xxxx)
const ADMIN_WA = "6281234567890";

const UndanganSyariah = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const openWa = (message) => {
    const url = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
      {/* Decorative Background */}
      <div className="top-0 left-0 z-0 absolute w-full h-full overflow-hidden pointer-events-none">
        <div className="top-20 left-10 absolute bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl rounded-full w-72 h-72" />
        <div className="right-10 bottom-20 absolute bg-amber-200/30 dark:bg-amber-900/20 blur-3xl rounded-full w-96 h-96" />
      </div>

      <div className="z-10 relative p-4 md:p-10">
        <div className="space-y-12 mx-auto max-w-6xl">
          {/* --- HEADER --- */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-2xl text-white">
                <Mail size={24} />
              </div>
              <div>
                <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
                  Undangan Syaria
                </h1>
                <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                  Platform Undangan Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  openWa(
                    "Halo Admin, saya ingin bertanya lebih lanjut tentang layanan Undangan Syaria.",
                  )
                }
                className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 shadow-green-500/30 shadow-lg px-4 py-2.5 rounded-2xl font-bold text-white text-xs transition-all">
                <MessageCircle size={16} />
                Chat Admin
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
                {isDark ? <Sun size={22} /> : <Moon size={22} />}
              </button>
            </div>
          </div>

          {/* --- HERO SECTION --- */}
          <div className="px-4 pt-8 pb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 mb-6 px-4 py-1.5 rounded-full font-bold text-emerald-700 dark:text-emerald-400 text-xs">
              <Sparkles size={14} />
              Solusi Undangan Pernikahan Digital
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 font-black text-slate-800 dark:text-white text-3xl md:text-5xl leading-tight">
              Hemat & Praktis, <br />
              <span className="bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent">
                Sebar Link, Bukan Kertas
              </span>
            </motion.h2>

            <p className="mx-auto mb-6 max-w-xl text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Buat undangan pernikahan digital yang elegan sesuai syar'i. Hemat
              biaya, mudah disebarluaskan via WhatsApp, dan dilengkapi fitur
              modern.
            </p>

            {/* Demo Button */}
            <a
              href="https://undangannikahsyari.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-slate-600 hover:text-emerald-500 dark:text-slate-300 text-sm transition-colors">
              <ExternalLink size={16} />
              Lihat Contoh Demo
            </a>
          </div>

          {/* --- PRICING GRID --- */}
          <div className="items-start gap-6 grid grid-cols-1 md:grid-cols-3">
            {paketData.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`relative ${pkg.bgColor} ${pkg.border} border rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  pkg.badge
                    ? "shadow-2xl shadow-emerald-500/20 z-20"
                    : "shadow-lg"
                }`}>
                {/* Badge */}
                {pkg.badge && (
                  <div className="top-0 right-0 left-0 absolute flex justify-center -mt-1">
                    <div
                      className={`bg-gradient-to-r ${pkg.color} text-white text-[10px] font-black uppercase px-6 py-1 rounded-b-xl shadow-lg`}>
                      {pkg.badge}
                    </div>
                  </div>
                )}

                {/* Header Card */}
                <div className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                    <pkg.icon size={32} />
                  </div>
                  <h3 className={`font-black text-xl mb-1 ${pkg.textcolor}`}>
                    {pkg.name}
                  </h3>
                  <div className="flex justify-center items-baseline gap-1 text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-sm">Rp</span>
                    <span className={`text-4xl font-black ${pkg.textcolor}`}>
                      {pkg.price}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="px-8 pb-8">
                  <div className="bg-gray-200 dark:bg-slate-700 mb-6 h-px" />
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        {f.available ? (
                          <div className="flex flex-shrink-0 justify-center items-center bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-5 h-5">
                            <Check size={12} className="text-emerald-500" />
                          </div>
                        ) : (
                          <div className="flex flex-shrink-0 justify-center items-center bg-gray-100 dark:bg-slate-800 rounded-full w-5 h-5">
                            <X
                              size={12}
                              className="text-slate-300 dark:text-slate-600"
                            />
                          </div>
                        )}
                        <span
                          className={
                            f.available
                              ? `${pkg.textcolor} font-medium`
                              : "text-slate-400 dark:text-slate-600 text-xs line-through"
                          }>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openWa(pkg.waMessage)}
                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
                      pkg.badge
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30"
                        : `bg-slate-900 dark:bg-white text-white dark:text-slate-900`
                    }`}>
                    Pilih Paket
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- FOOTER CTA --- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="py-12 text-center">
            <p className="mb-2 text-slate-400 text-xs">
              Punya pertanyaan atau request fitur khusus?
            </p>
            <button
              onClick={() =>
                openWa(
                  "Assalamualaikum Admin, saya ingin bertanya tentang layanan undangan digital.",
                )
              }
              className="inline-flex items-center gap-2 font-bold text-emerald-500 hover:underline">
              <MessageCircle size={16} />
              Hubungi Kami via WhatsApp
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UndanganSyariah;
