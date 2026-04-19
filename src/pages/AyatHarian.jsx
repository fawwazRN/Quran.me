import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Quote, ArrowRight } from "lucide-react";

const AyatHarian = () => {
  const { surahList } = useSelector((state) => state.quran);
  const [dailyAyat, setDailyAyat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRandomAyat = async () => {
      // Pastikan surahList sudah ada dan kita belum punya dailyAyat
      if (surahList.length > 0 && !dailyAyat && !loading) {
        setLoading(true);
        try {
          // 1. Pilih nomor surat acak (1-114)
          const randomSurahNo = Math.floor(Math.random() * 114) + 1;

          // 2. Fetch detail surat tersebut untuk ambil ayatnya
          const response = await fetch(
            `https://equran.id/api/v2/surat/${randomSurahNo}`,
          );
          const resData = await response.json();
          const surah = resData.data;

          // 3. Pilih satu ayat acak dari surat tersebut
          const randomAyatIndex = Math.floor(Math.random() * surah.ayat.length);
          const ayat = surah.ayat[randomAyatIndex];

          setDailyAyat({
            ...ayat,
            surahName: surah.namaLatin,
            surahNo: surah.nomor,
          });
        } catch (error) {
          console.error("Gagal mengambil ayat harian:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRandomAyat();
  }, [surahList, dailyAyat, loading]);

  if (!dailyAyat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-linear-to-br from-emerald-600 to-teal-700 shadow-2xl shadow-emerald-500/20 mb-8 p-8 rounded-[2.5rem] overflow-hidden text-white">
      <Sparkles className="top-4 right-4 absolute opacity-20" size={40} />
      <Quote className="-bottom-2 -left-2 absolute opacity-10" size={120} />

      <div className="z-10 relative">
        <span className="flex items-center gap-2 opacity-80 mb-6 font-black text-[10px] uppercase tracking-[0.3em]">
          <span className="bg-white opacity-50 w-8 h-px"></span>
          Ayat Inspirasi Hari Ini
        </span>

        {/* Tampilan Ayat Arab */}
        <h2
          className="mb-6 font-arabic text-3xl md:text-4xl text-right leading-[1.8]"
          dir="rtl">
          {dailyAyat.teksArab}
        </h2>

        <div className="space-y-3 mb-8">
          {/* Terjemahan */}
          <p className="font-medium text-emerald-50 text-lg italic line-clamp-3 leading-relaxed">
            "{dailyAyat.teksIndonesia}"
          </p>

          {/* Sumber Surat & Ayat */}
          <p className="font-black text-[10px] text-white/60 uppercase tracking-widest">
            — QS. {dailyAyat.surahName}: Ayat {dailyAyat.nomorAyat}
          </p>
        </div>

        {/* Tombol yang bisa diklik mengarah ke surat */}
        <Link
          to={`/surat/${dailyAyat.surahNo}`}
          className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white backdrop-blur-md px-6 py-3 border border-white/20 rounded-2xl font-bold hover:text-emerald-700 text-xs transition-all">
          BACA SURATNYA
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.div>
  );
};

export default AyatHarian;
