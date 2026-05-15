import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Share2,
  Heart,
  BookOpen,
  BookmarkCheck,
  Play,
  Pause,
  Copy,
  Volume2,
  SkipBack,
  SkipForward,
  Settings2,
  X,
} from "lucide-react";
import {
  getSurahDetail,
  toggleFavoriteAyat,
  setLastRead,
  getSurahTafsir,
} from "../features/quranSlice";
import { SkeletonAyat } from "../components/Skeleton";
import Tafsir from "./Tafsir";

const Detail = () => {
  const { nomor } = useParams();
  const ayatRefs = useRef({});
  const dispatch = useDispatch();
  const [selectedTafsir, setSelectedTafsir] = useState(null); // Menyimpan objek {ayat, teks}
  const { detailSurah, loading, favoriteAyats, lastRead, tafsirData } =
    useSelector((state) => state.quran);

  // Audio & UX States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyat, setCurrentAyat] = useState(null); // null = full surah, number = per ayat
  const [selectedQari, setSelectedQari] = useState("05"); // Default Misyari Rasyid
  const [showQariModal, setShowQariModal] = useState(false);
  const audioRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const qariList = [
    { id: "01", name: "Abdullah Al-Juhany" },
    { id: "02", name: "Abdul Muhsin Al-Qasim" },
    { id: "03", name: "Abdurrahman as-Sudais" },
    { id: "04", name: "Ibrahim Al-Dossari" },
    { id: "05", name: "Misyari Rasyid Al-Afasy" },
  ];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    dispatch(getSurahDetail(nomor));
    dispatch(getSurahTafsir(nomor));
    window.scrollTo(0, 0);
    const handleScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, nomor]);

  useEffect(() => {
    // Pastikan currentAyat ada dan elemen ref-nya sudah ter-render
    if (currentAyat && ayatRefs.current[currentAyat]) {
      ayatRefs.current[currentAyat].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentAyat]);

  // 1. FUNGSI SHARE
  const handleShare = (ayat) => {
    const text = `Q.S ${detailSurah.namaLatin}: ${ayat.nomorAyat}\n\n${ayat.teksArab}\n\nArtinya: "${ayat.teksIndonesia}"`;
    if (navigator.share) {
      navigator.share({ title: detailSurah.namaLatin, text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Teks ayat berhasil disalin ke clipboard!");
    }
  };

  // 2. FUNGSI AUDIO (PER AYAT & FULL SURAT)
  const togglePlay = (ayatNomor = null) => {
    if (currentAyat === ayatNomor && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentAyat(ayatNomor);
      const newSrc = ayatNomor
        ? detailSurah.ayat.find((a) => a.nomorAyat === ayatNomor).audio[
            selectedQari
          ]
        : detailSurah.audioFull[selectedQari];

      audioRef.current.src = newSrc;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentAyat && currentAyat < detailSurah.jumlahAyat) {
      togglePlay(currentAyat + 1);
    } else if (!currentAyat) {
      alert("Anda sedang memutar full surat");
    }
  };

  const handlePrev = () => {
    if (currentAyat && currentAyat > 1) {
      togglePlay(currentAyat - 1);
    }
  };

  const isFav = (ayatNomor) =>
    favoriteAyats.some(
      (fav) => fav.favId === `${detailSurah?.namaLatin}-${ayatNomor}`,
    );

  if (loading)
    return (
      <div className="bg-[#050505] p-6 min-h-screen">
        <SkeletonAyat />
      </div>
    );

  return (
    <div className="bg-[#F8FAFC] dark:bg-transparent pb-44 min-h-screen transition-colors duration-500">
      {/* PROGRESS BAR */}
      <motion.div
        className="top-0 right-0 left-0 z-210 fixed bg-emerald-500 h-1 origin-left"
        style={{ scaleX }}
      />

      {/* NAVBAR */}
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 right-0 z-100 transition-all duration-500 
    left-0 lg:left-80 
    ${
      isScrolled
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl py-3 border-b dark:border-white/5"
        : "py-6"
    }`}>
        <div className="flex justify-between items-center mx-auto px-6 max-w-5xl container">
          <Link
            to="/"
            className="bg-white hover:bg-emerald-500 dark:bg-slate-900 shadow-sm p-3 border dark:border-white/5 rounded-2xl hover:text-white dark:text-white transition-all">
            <ChevronLeft size={24} />
          </Link>

          <div className="text-right">
            <h2 className="font-black dark:text-white text-lg">
              {detailSurah?.namaLatin}
            </h2>
            <p className="font-bold text-[10px] text-emerald-500 uppercase tracking-widest">
              {detailSurah?.arti}
            </p>
          </div>
        </div>
      </nav>

      <div className="mx-auto px-5 pt-28 max-w-4xl container">
        {/* HEADER HERO */}
        <header className="relative bg-linear-to-br from-emerald-600 dark:from-emerald-900 to-emerald-800 dark:to-slate-900 shadow-2xl mb-12 p-10 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden text-white text-center">
          {/* Dekorasi Ikon */}
          <BookOpen
            className="-bottom-12 -left-12 absolute opacity-10 rotate-12 pointer-events-none"
            size={280}
          />

          <div className="z-10 relative">
            <h1 className="drop-shadow-2xl mb-4 font-arabic text-6xl md:text-8xl">
              {detailSurah?.nama}
            </h1>
            <h2 className="font-black text-3xl md:text-5xl">
              {detailSurah?.namaLatin}
            </h2>
            <p className="mt-2 font-bold text-emerald-100/60 text-sm uppercase tracking-[0.3em]">
              {detailSurah?.arti} • {detailSurah?.jumlahAyat} AYAT
            </p>

            {/* Tombol Kontrol */}
            <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setShowQariModal(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 border border-white/20 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all">
                <Settings2 size={16} />
                Qari: {qariList.find((q) => q.id === selectedQari)?.name}
              </button>

              <button
                onClick={() => togglePlay(null)}
                className="flex items-center gap-3 bg-white shadow-xl px-8 py-3 rounded-full font-bold text-emerald-700 hover:scale-105 active:scale-95 transition-all">
                {currentAyat === null && isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
                <span>Putar Full Surat</span>
              </button>
            </div>
          </div>
        </header>

        {/* AYAT LIST */}
        <div className="space-y-6">
          {detailSurah?.ayat.map((ayat) => (
            <motion.div
              key={ayat.nomorAyat}
              ref={(el) => (ayatRefs.current[ayat.nomorAyat] = el)}
              onViewportEnter={() =>
                dispatch(
                  setLastRead({
                    nomorSurat: nomor,
                    namaSurat: detailSurah.namaLatin,
                    nomorAyat: ayat.nomorAyat,
                  }),
                )
              }
              className={`p-8 md:p-12 rounded-[3rem] transition-all duration-500 ${
                currentAyat === ayat.nomorAyat
                  ? "bg-emerald-500/10 ring-2 ring-emerald-500"
                  : "bg-white dark:bg-white/5"
              } ${lastRead?.nomorAyat === ayat.nomorAyat && "ring-1 ring-emerald-500/30"}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-slate-900 rounded-2xl w-12 h-12 font-black text-white">
                    {ayat.nomorAyat}
                  </div>
                  {lastRead?.nomorAyat === ayat.nomorAyat && (
                    <span className="max-sm:hidden bg-emerald-500 px-3 py-1 rounded-full font-black text-[9px] text-white uppercase tracking-tighter">
                      Terakhir Dibaca
                    </span>
                  )}
                </div>

                {/* TOOLBAR AYAT */}
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePlay(ayat.nomorAyat)}
                    className={`p-3 rounded-xl transition-all ${currentAyat === ayat.nomorAyat && isPlaying ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-white/5 text-slate-400"}`}>
                    {currentAyat === ayat.nomorAyat && isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleShare(ayat)}
                    className="bg-gray-100 dark:bg-white/5 p-3 rounded-xl text-slate-400 hover:text-emerald-500">
                    <Share2 size={20} />
                  </button>
                  <button
                    onClick={() =>
                      dispatch(
                        toggleFavoriteAyat({
                          surahName: detailSurah.namaLatin,
                          ayat,
                        }),
                      )
                    }
                    className={`p-3 rounded-xl ${isFav(ayat.nomorAyat) ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-white/5 text-slate-400"}`}>
                    <Heart
                      size={20}
                      fill={isFav(ayat.nomorAyat) ? "currentColor" : "none"}
                    />
                  </button>
                  {/* Tambahkan tombol ini di sebelah tombol Share/Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Cari teks tafsir yang nomor ayatnya sama
                      const tafsirAyat = tafsirData?.tafsir?.find(
                        (t) => t.ayat === ayat.nomorAyat,
                      );

                      setSelectedTafsir({
                        nomorAyat: ayat.nomorAyat,
                        teks: tafsirAyat
                          ? tafsirAyat.teks
                          : "Tafsir sedang dimuat atau tidak ditemukan.",
                      });
                    }}
                    className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-gray-400 hover:text-emerald-500 transition-all">
                    <BookOpen size={20} />
                  </button>
                </div>
              </div>

              <h2
                className="space-x-1 space-x-reverse mb-8 font-amiri dark:text-white max-sm:text-3xl text-5xl text-right leading-[2] max-sm:leading-[2.5] tracking-wide"
                dir="rtl">
                {ayat.teksArab}
              </h2>
              <p className="mb-3 font-bold text-emerald-500 max-sm:text-[16px] text-lg italic leading-relaxed">
                {ayat.teksLatin}
              </p>
              <p className="font-medium text-slate-500 dark:text-slate-400 max-sm:text-lg text-xl leading-relaxed">
                {ayat.teksIndonesia}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLOATING PLAYER (PERSIS GAMBAR) */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bottom-8 left-1/2 z-250 fixed w-[95%] max-w-md -translate-x-1/2">
          <div className="flex justify-between items-center bg-white/90 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl p-4 border dark:border-white/10 rounded-[2.5rem]">
            <div className="flex items-center gap-3 pl-2">
              <div
                className={`w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg ${isPlaying && "animate-spin-slow"}`}>
                <Volume2 size={24} />
              </div>
              <div className="max-w-25">
                <h4 className="font-black text-[10px] dark:text-white truncate uppercase">
                  {currentAyat ? `Ayat ${currentAyat}` : "Full Surat"}
                </h4>
                <p className="font-bold text-[9px] text-emerald-500 truncate tracking-tighter">
                  {qariList.find((q) => q.id === selectedQari).name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-2 text-slate-400 hover:text-emerald-500 transition-all">
                <SkipBack size={22} />
              </button>
              <button
                onClick={() => togglePlay(currentAyat)}
                className="flex justify-center items-center bg-emerald-500 shadow-emerald-500/40 shadow-lg rounded-full w-14 h-14 text-white hover:scale-105 active:scale-95 transition-all">
                {isPlaying ? (
                  <Pause size={30} fill="currentColor" />
                ) : (
                  <Play size={30} fill="currentColor" className="ml-1" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-slate-400 hover:text-emerald-500 transition-all">
                <SkipForward size={22} />
              </button>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gray-100 dark:bg-white/5 mr-2 p-3 rounded-2xl text-slate-400 hover:text-emerald-500">
              <BookmarkCheck size={20} />
            </button>
          </div>
          <audio
            ref={audioRef}
            onEnded={() => {
              setIsPlaying(false);
              handleNext();
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* MODAL SETTINGS QARI */}
      <AnimatePresence>
        {showQariModal && (
          <div className="z-300 fixed inset-0 flex justify-center items-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQariModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 shadow-2xl p-8 border dark:border-white/10 rounded-[3rem] w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black dark:text-white text-xl">
                  Pilih Qari
                </h3>
                <button
                  onClick={() => setShowQariModal(false)}
                  className="text-slate-400">
                  <X />
                </button>
              </div>
              <div className="space-y-3">
                {qariList.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQari(q.id);
                      setShowQariModal(false);
                      setIsPlaying(false);
                    }}
                    className={`w-full p-4 rounded-3xl text-left font-bold transition-all flex items-center justify-between ${selectedQari === q.id ? "bg-emerald-500 text-white" : "bg-gray-50 dark:bg-white/5 dark:text-slate-300"}`}>
                    {q.name}
                    {selectedQari === q.id && <BookmarkCheck size={18} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Tafsir
        isOpen={!!selectedTafsir}
        onClose={() => setSelectedTafsir(null)}
        surahName={detailSurah?.namaLatin}
        ayatNumber={selectedTafsir?.nomorAyat}
        teksTafsir={selectedTafsir?.teks}
      />
    </div>
  );
};

export default Detail;
