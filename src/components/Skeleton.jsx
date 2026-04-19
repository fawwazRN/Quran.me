import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSurah,
  setSearchTerm,
  vectorSearch,
  setVectorSearchQuery,
  setVectorActiveTab,
  resetVectorSearch,
} from "../features/quranSlice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Heart,
  Bookmark,
  Clock,
  ChevronRight,
  Moon,
  Sun,
  Sparkles,
  X,
  BookText,
  FileText,
  MessageCircle,
  HandHeart,
  ArrowRight,
  Loader2,
} from "lucide-react";
import AyatHarian from "../pages/AyatHarian";

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

// =============================================
// BARU: Skeleton untuk Vector Search Results
// =============================================
export const SkeletonVectorResult = () => (
  <div className="space-y-3 bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl animate-pulse">
    <div className="flex items-center gap-2">
      <div className="bg-gray-200 dark:bg-slate-700 rounded-full w-6 h-6"></div>
      <div className="bg-gray-200 dark:bg-slate-700 rounded-full w-16 h-5"></div>
      <div className="bg-gray-200 dark:bg-slate-700 ml-auto rounded-full w-12 h-5"></div>
    </div>
    <div className="bg-gray-200 dark:bg-slate-700 ml-auto rounded-xl w-full h-16"></div>
    <div className="bg-gray-200 dark:bg-slate-700 rounded-xl w-3/4 h-5"></div>
  </div>
);

// =============================================
// BARU: Komponen Badge Tipe
// =============================================
const TypeBadge = ({ tipe }) => {
  const config = {
    ayat: {
      label: "Ayat",
      icon: <BookText size={12} />,
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    tafsir: {
      label: "Tafsir",
      icon: <MessageCircle size={12} />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    surat: {
      label: "Surat",
      icon: <BookOpen size={12} />,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    doa: {
      label: "Doa",
      icon: <HandHeart size={12} />,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
  };

  const c = config[tipe] || config.ayat;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.color}`}>
      {c.icon}
      {c.label}
    </span>
  );
};

// =============================================
// BARU: Komponen Badge Relevansi
// =============================================
const RelevansiBadge = ({ relevansi }) => {
  const colors = {
    tinggi: "bg-emerald-500 text-white",
    sedang: "bg-amber-500 text-white",
    rendah: "bg-gray-400 text-white dark:bg-slate-600",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${colors[relevansi] || colors.rendah}`}>
      {relevansi}
    </span>
  );
};

// =============================================
// BARU: Komponen Kartu Hasil Vector Search
// =============================================
const VectorResultCard = ({ result, index }) => {
  const { tipe, skor, relevansi, data } = result;

  // Render konten berdasarkan tipe
  const renderContent = () => {
    switch (tipe) {
      case "ayat":
        return (
          <Link to={`/surat/${data.id_surat}`}>
            <div className="group bg-white dark:bg-slate-800 hover:shadow-emerald-500/10 hover:shadow-xl p-6 border border-gray-100 hover:border-emerald-500 dark:border-slate-700 rounded-2xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <TypeBadge tipe={tipe} />
                  <RelevansiBadge relevansi={relevansi} />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  skor: {skor.toFixed(3)}
                </span>
              </div>

              <div className="mb-4 font-arabic text-slate-800 dark:group-hover:text-emerald-400 dark:text-slate-100 group-hover:text-emerald-700 text-2xl text-right leading-loose transition-colors">
                {data.teks_arab}
              </div>

              <p className="mb-2 text-slate-500 dark:text-slate-400 text-xs italic leading-relaxed">
                {data.teks_latin}
              </p>

              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {data.terjemahan_id}
              </p>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {data.nama_surat}
                  </span>
                  <span className="ml-2 text-slate-400 text-xs">
                    Ayat {data.nomor_ayat}
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        );

      case "tafsir":
        return (
          <Link to={`/surat/${data.id_surat}`}>
            <div className="group bg-white dark:bg-slate-800 hover:shadow-blue-500/10 hover:shadow-xl p-6 border border-gray-100 hover:border-blue-500 dark:border-slate-700 rounded-2xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <TypeBadge tipe={tipe} />
                  <RelevansiBadge relevansi={relevansi} />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  skor: {skor.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {data.nama_surat}
                </span>
                <span className="text-slate-400 text-xs">
                  Ayat {data.nomor_ayat}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-4 leading-relaxed">
                {data.isi}
              </p>

              <div className="flex justify-end mt-4">
                <ArrowRight
                  size={16}
                  className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        );

      case "surat":
        return (
          <Link to={`/surat/${data.id_surat}`}>
            <div className="group bg-white dark:bg-slate-800 hover:shadow-purple-500/10 hover:shadow-xl p-6 border border-gray-100 hover:border-purple-500 dark:border-slate-700 rounded-2xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <TypeBadge tipe={tipe} />
                  <RelevansiBadge relevansi={relevansi} />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  skor: {skor.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-900/30 rounded-xl w-12 h-12">
                  <span className="font-bold text-purple-700 dark:text-purple-400 text-sm">
                    {data.id_surat}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    {data.nama}
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {data.nama_arab} — {data.arti}
                  </p>
                </div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-3 leading-relaxed">
                {data.deskripsi}
              </p>

              <div className="flex gap-3 mt-3 text-[10px] text-slate-400">
                <span>{data.jumlah_ayat} Ayat</span>
                <span>{data.tempat_turun}</span>
              </div>
            </div>
          </Link>
        );

      case "doa":
        return (
          <div className="group bg-white dark:bg-slate-800 hover:shadow-amber-500/10 hover:shadow-xl p-6 border border-gray-100 hover:border-amber-500 dark:border-slate-700 rounded-2xl transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TypeBadge tipe={tipe} />
                <RelevansiBadge relevansi={relevansi} />
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                skor: {skor.toFixed(3)}
              </span>
            </div>

            <h4 className="mb-3 font-bold text-slate-800 dark:text-slate-100">
              {data.judul}
            </h4>

            <div className="mb-3 font-arabic text-slate-800 dark:group-hover:text-amber-400 dark:text-slate-100 group-hover:text-amber-700 text-xl text-right leading-loose transition-colors">
              {data.teks_arab}
            </div>

            <p className="mb-2 text-slate-500 dark:text-slate-400 text-xs italic">
              {data.teks_latin}
            </p>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {data.terjemahan}
            </p>

            {data.grup && (
              <div className="mt-3">
                <span className="font-bold text-[10px] text-amber-600 dark:text-amber-400">
                  {data.grup}
                </span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}>
      {renderContent()}
    </motion.div>
  );
};

// =============================================
// BARU: Tab Filter untuk Vector Search
// =============================================
const FilterTabs = () => {
  const dispatch = useDispatch();
  const { vectorActiveTab } = useSelector((state) => state.quran);

  const tabs = [
    { id: "semua", label: "Semua", icon: <Sparkles size={14} /> },
    { id: "ayat", label: "Ayat", icon: <BookText size={14} /> },
    { id: "tafsir", label: "Tafsir", icon: <MessageCircle size={14} /> },
    { id: "surat", label: "Surat", icon: <BookOpen size={14} /> },
    { id: "doa", label: "Doa", icon: <HandHeart size={14} /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => dispatch(setVectorActiveTab(tab.id))}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            vectorActiveTab === tab.id
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "bg-gray-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600"
          }`}>
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// =============================================
// BARU: Panel Hasil Vector Search
// =============================================
const VectorSearchPanel = () => {
  const dispatch = useDispatch();
  const {
    vectorSearchResults,
    vectorSearchLoading,
    vectorSearchError,
    vectorSearchQuery,
    vectorActiveTab,
  } = useSelector((state) => state.quran);

  const results = vectorSearchResults?.hasil || [];
  const totalJumlah = vectorSearchResults?.jumlah || 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-5">
        {/* Tab Filter */}
        <FilterTabs />

        {/* Error */}
        {vectorSearchError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm">
            {vectorSearchError}
          </motion.div>
        )}

        {/* Loading */}
        {vectorSearchLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonVectorResult key={i} />
            ))}
          </div>
        )}

        {/* Hasil Kosong */}
        {!vectorSearchLoading &&
          vectorSearchResults &&
          results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-2xl text-center">
              <Search
                size={40}
                className="mx-auto mb-3 text-gray-300 dark:text-slate-700"
              />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tidak ditemukan hasil untuk{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  &quot;{vectorSearchQuery}&quot;
                </span>
              </p>
              <p className="mt-1 text-slate-400 text-xs">
                Coba gunakan kata kunci yang lebih spesifik atau ubah filter
                tipe
              </p>
            </motion.div>
          )}

        {/* Daftar Hasil */}
        {!vectorSearchLoading &&
          results.length > 0 &&
          results.map((result, index) => (
            <VectorResultCard
              key={`${result.tipe}-${result.data.id_surat || result.data.id_doa || index}`}
              result={result}
              index={index}
            />
          ))}

        {/* Info Jumlah Hasil */}
        {!vectorSearchLoading && vectorSearchResults && results.length > 0 && (
          <div className="text-center">
            <p className="text-[10px] text-slate-400">
              Ditemukan {totalJumlah} hasil untuk{" "}
              <span className="font-bold">&quot;{vectorSearchQuery}&quot;</span>
              {vectorActiveTab !== "semua" && (
                <span>
                  {" "}
                  (filter:{" "}
                  <span className="text-emerald-500">{vectorActiveTab}</span>)
                </span>
              )}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// ============ MAIN HOME COMPONENT ============
const Home = () => {
  const dispatch = useDispatch();

  // Ambil state dari Redux
  const {
    surahList,
    loading,
    searchTerm,
    favoriteAyats,
    lastRead,
    vectorSearchQuery,
    vectorSearchLoading,
    vectorFilterTypes,
  } = useSelector((state) => state.quran);

  // State untuk Dark Mode
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // =============================================
  // BARU: State untuk mode UI (daftar vs search)
  // =============================================
  const [activeMode, setActiveMode] = useState("daftar"); // "daftar" | "ai"

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

  // FITUR SEARCH BIASA: Memfilter daftar surat
  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // =============================================
  // BARU: Handler untuk Vector Search
  // =============================================
  const handleVectorSearch = useCallback(() => {
    if (!vectorSearchQuery.trim()) return;

    const params = {
      cari: vectorSearchQuery.trim(),
      batas: 10,
    };

    // vectorFilterTypes sudah diambil dari useSelector di atas
    if (vectorFilterTypes.length > 0) {
      params.tipe = vectorFilterTypes;
    }

    dispatch(vectorSearch(params));
  }, [dispatch, vectorSearchQuery, vectorFilterTypes]);

  const handleVectorKeyDown = (e) => {
    if (e.key === "Enter") {
      handleVectorSearch();
    }
  };

  // Pindah ke mode search dan reset
  const switchToAiMode = () => {
    setActiveMode("ai");
  };

  const switchToDaftarMode = () => {
    setActiveMode("daftar");
  };

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
          <aside
            className={`space-y-8 ${activeMode === "daftar" ? "lg:col-span-4" : "lg:col-span-12"}`}>
            {/* ============================================= */}
            {/* BARU: Mode Switcher (Daftar / AI Search)      */}
            {/* ============================================= */}
            <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-3xl">
              <button
                onClick={switchToDaftarMode}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeMode === "daftar"
                    ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}>
                <BookOpen size={16} />
                Daftar Surah
              </button>
              <button
                onClick={switchToAiMode}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeMode === "ai"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-slate-600"
                }`}>
                <Sparkles size={16} />
                AI Search
              </button>
            </div>

            {/* ============================================= */}
            {/* SEARCH INPUT: Berubah sesuai mode             */}
            {/* ============================================= */}
            {activeMode === "daftar" ? (
              /* --- MODE DAFTAR: Cari nama surah --- */
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
            ) : (
              /* --- MODE AI: Vector Search (Pencarian Semantik) --- */
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3">
                <div className="group relative">
                  <Sparkles
                    className="top-1/2 left-5 absolute text-emerald-400 group-focus-within:text-emerald-500 transition-colors -translate-y-1/2"
                    size={20}
                  />
                  <input
                    type="text"
                    value={vectorSearchQuery}
                    placeholder="Tanya apa saja tentang Al-Quran..."
                    className="bg-gradient-to-r from-emerald-50 dark:from-slate-900 to-teal-50 dark:to-slate-900 shadow-inner p-5 pr-24 pl-14 border border-emerald-200 dark:border-slate-700 rounded-4xl outline-none ring-2 ring-transparent focus:ring-emerald-500/30 w-full dark:text-white placeholder:text-slate-400 transition-all"
                    onChange={(e) =>
                      dispatch(setVectorSearchQuery(e.target.value))
                    }
                    onKeyDown={handleVectorKeyDown}
                  />
                  <button
                    onClick={handleVectorSearch}
                    disabled={vectorSearchLoading || !vectorSearchQuery.trim()}
                    className="top-1/2 right-2 absolute flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 px-4 py-2.5 rounded-2xl font-bold text-white text-xs active:scale-95 transition-all -translate-y-1/2 disabled:cursor-not-allowed">
                    {vectorSearchLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Search size={14} />
                    )}
                    Cari
                  </button>
                </div>

                {/* Hint contoh query */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "ayat tentang sabar",
                    "doa sebelum tidur",
                    "surat turun di Madinah",
                    "tafsir tentang shalat",
                  ].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => {
                        dispatch(setVectorSearchQuery(hint));
                        dispatch(vectorSearch({ cari: hint, batas: 5 }));
                      }}
                      className="bg-white dark:bg-slate-800 px-3 py-1.5 border border-gray-100 hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700 rounded-full text-[10px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                      {hint}
                    </button>
                  ))}
                </div>

                {/* Panel Hasil Vector Search */}
                <VectorSearchPanel />
              </motion.div>
            )}

            <AyatHarian />

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
                    const targetSurah = surahList.find(
                      (s) =>
                        s.namaLatin.toLowerCase() ===
                        fav.surahName.toLowerCase(),
                    );
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
                            &quot;{fav.teksIndonesia}&quot;
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
            {/* Sembunyikan daftar surah saat mode AI aktif */}
            {activeMode === "daftar" && (
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
                          <div className="group bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-emerald-500/10 p-6 border border-gray-100 hover:border-emerald-500 dark:border-slate-800 dark:hover:border-emerald-500 rounded-4xl active:scale-95 transition-all">
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
            )}
          </main>
        </main>
      </div>
    </div>
  );
};

export default Home;
