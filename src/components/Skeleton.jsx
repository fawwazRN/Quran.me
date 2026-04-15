import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSurah, setSearchTerm } from "../features/quranSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Heart,
  Bookmark,
  Clock,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

// ============ SKELETON COMPONENTS ============
export const SkeletonCard = () => (
  <div className="bg-gray-200 dark:bg-slate-800 shadow-sm rounded-3xl h-28 animate-pulse"></div>
);

export const SkeletonAyat = () => (
  <div className="space-y-6 bg-gray-100 dark:bg-slate-800 p-8 rounded-[2.5rem] animate-pulse">
    <div className="flex justify-between">
      <div className="bg-gray-300 dark:bg-slate-700 rounded-2xl w-24 h-10"></div>
      <div className="bg-gray-300 dark:bg-slate-700 rounded-2xl w-12 h-12"></div>
    </div>
    <div className="bg-gray-300 dark:bg-slate-700 ml-auto rounded-xl w-3/4 h-12"></div>
    <div className="bg-gray-300 dark:bg-slate-700 rounded-xl w-full h-6"></div>
  </div>
);

// ============ MAIN HOME COMPONENT ============
const Home = () => {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const { surahList, loading, searchTerm, favoriteAyats, lastRead } =
    useSelector((state) => state.quran);

  // State untuk Dark Mode
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    dispatch(getAllSurah());
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dispatch, isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // FITUR SEARCH: Memfilter daftar surat
  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <div className="mx-auto p-4 md:p-10 container">
        {/* --- TOP BAR --- */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-xl text-white">
              <BookOpen size={24} />
            </div>
            <h1 className="font-black dark:text-white text-2xl tracking-tighter">
              QURAN.ME
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-slate-900 shadow-sm p-3 border border-transparent dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        <main className="gap-10 grid grid-cols-1 lg:grid-cols-12">
          {/* --- SIDEBAR (KIRI) --- */}
          <aside className="space-y-8 lg:col-span-4">
            {/* INPUT SEARCH */}
            <div className="group relative">
              <Search
                className="top-1/2 left-5 absolute text-slate-400 group-focus-within:text-emerald-500 transition-colors -translate-y-1/2"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                placeholder="Cari Surah..."
                className="bg-gray-50 dark:bg-slate-900 shadow-inner p-5 pl-14 border-none rounded-4xl outline-none ring-2 ring-transparent focus:ring-emerald-500/20 w-full dark:text-white transition-all"
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
            </div>

            {/* CARD LAST READ */}
            {lastRead && (
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}>
                <Link to={`/surat/${lastRead.nomorSurat}`}>
                  <div className="group relative bg-emerald-600 shadow-2xl shadow-emerald-500/30 p-8 border border-white/10 rounded-[2.5rem] overflow-hidden text-white">
                    <Clock
                      className="-top-4 -right-4 absolute opacity-10 group-hover:rotate-12 transition-transform"
                      size={140}
                    />
                    <div className="flex items-center gap-2 opacity-80 mb-6">
                      <Bookmark size={14} fill="currentColor" />
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">
                        Terakhir Dibaca
                      </span>
                    </div>
                    <h2 className="mb-1 font-black text-4xl leading-tight">
                      {lastRead.namaSurat}
                    </h2>
                    <p className="flex items-center gap-2 font-bold text-emerald-100 text-sm">
                      Ayat {lastRead.nomorAyat} <ChevronRight size={14} />
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* DAFTAR FAVORIT AYAT */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-8 border border-gray-100 dark:border-slate-800 rounded-[2.5rem]">
              <h3 className="flex items-center gap-3 mb-6 font-black dark:text-white text-xl">
                <Heart size={22} className="fill-red-500 text-red-500" />{" "}
                Favorit Ayat
              </h3>
              <div className="space-y-4 pr-2 max-h-100 overflow-y-auto custom-scrollbar">
                {favoriteAyats.length > 0 ? (
                  favoriteAyats.map((fav) => {
                    // SOLUSI FIX: Cari nomor surat yang BENAR dari surahList agar tidak salah buka An-Nisa (Surat 4)
                    const targetSurah = surahList.find(
                      (s) =>
                        s.namaLatin.toLowerCase() ===
                        fav.surahName.toLowerCase(),
                    );

                    // LinkPath menggunakan nomor asli dari objek surat, bukan angka acak
                    const linkPath = targetSurah
                      ? `/surat/${targetSurah.nomor}`
                      : `/surat/1`;

                    return (
                      <Link to={linkPath} key={fav.favId}>
                        <motion.div
                          whileHover={{ x: 6 }}
                          className="bg-white hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-900/20 shadow-sm mb-3 p-5 border border-gray-100 dark:border-transparent border-l-4 rounded-2xl transition-all">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-black text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                              {fav.surahName}
                            </span>
                            <span className="font-bold text-[10px] text-slate-400">
                              Ayat {fav.nomorAyat}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                            "{fav.teksIndonesia}"
                          </p>
                        </motion.div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-10 text-center">
                    <Heart
                      size={40}
                      className="mx-auto mb-2 text-gray-200 dark:text-slate-800"
                    />
                    <p className="text-slate-400 text-xs italic">
                      Belum ada ayat favorit
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* --- MAIN LIST (KANAN) --- */}
          <main className="lg:col-span-8">
            <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
              {loading
                ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                : filteredSurah.map((surah, index) => (
                    <motion.div
                      key={surah.nomor}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.01 }}>
                      <Link to={`/surat/${surah.nomor}`}>
                        <div className="group bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-emerald-500/10 p-6 border border-gray-100 hover:border-emerald-500 dark:border-slate-800 dark:hover:border-emerald-500 rounded-[2rem] active:scale-95 transition-all">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-5">
                              <div className="flex justify-center items-center bg-gray-100 dark:bg-slate-800 group-hover:bg-emerald-500 shadow-inner rounded-2xl w-14 h-14 font-black text-slate-800 dark:text-white group-hover:text-white transition-all">
                                {surah.nomor}
                              </div>
                              <div>
                                <h4 className="mb-1 font-black text-slate-800 dark:text-slate-100 text-lg leading-tight">
                                  {surah.namaLatin}
                                </h4>
                                <p className="font-bold text-[10px] text-slate-400 group-hover:text-emerald-500 uppercase tracking-widest transition-colors">
                                  {surah.arti}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <h4 className="mb-1 font-arabic text-emerald-600 dark:text-emerald-400 text-3xl">
                                {surah.nama}
                              </h4>
                              <span className="bg-gray-50 dark:bg-slate-800 group-hover:bg-emerald-500/10 px-3 py-1 rounded-full font-black text-[9px] text-slate-400 group-hover:text-emerald-500 uppercase transition-all">
                                {surah.jumlahAyat} Ayat
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          </main>
        </main>
      </div>
    </div>
  );
};

export default Home;
