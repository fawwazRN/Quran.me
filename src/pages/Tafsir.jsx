import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Quote, ChevronRight } from "lucide-react";

const Tafsir = ({ isOpen, onClose, surahName, ayatNumber, teksTafsir }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="z-300 fixed inset-0 flex justify-center items-center p-4 md:p-6">
          {/* Backdrop / Overlay Hitam */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Konten Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] w-full max-w-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-gray-100 dark:border-slate-800 border-b">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl w-10 h-10 text-emerald-600 dark:text-emerald-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white">
                    Tafsir Ringkas
                  </h3>
                  <p className="font-bold text-[10px] text-emerald-500 uppercase tracking-widest">
                    {surahName} : Ayat {ayatNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="group flex justify-center items-center bg-gray-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-full w-10 h-10 text-slate-400 hover:text-red-500 transition-all">
                <X
                  size={20}
                  className="group-hover:rotate-90 transition-transform"
                />
              </button>
            </div>

            {/* Isi Tafsir */}
            <div className="p-8 md:p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start gap-4 mb-6">
                <Quote
                  className="mt-1 text-emerald-200 dark:text-slate-700 shrink-0"
                  size={32}
                />
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  {teksTafsir || "Memuat konten tafsir..."}
                </p>
              </div>

              {/* Informasi Tambahan */}
              <div className="bg-emerald-50 dark:bg-emerald-900/10 mt-8 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                  <ChevronRight size={16} />
                  <span className="font-black text-xs uppercase tracking-tighter">
                    Catatan
                  </span>
                </div>
                <p className="text-emerald-600/80 dark:text-emerald-400/60 text-xs leading-relaxed">
                  Tafsir ini bersumber dari Kementerian Agama Republik Indonesia
                  (Kemenag) untuk memberikan pemahaman kontekstual yang akurat
                  terhadap ayat tersebut.
                </p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-6 text-center">
              <button
                onClick={onClose}
                className="bg-emerald-500 shadow-emerald-500/20 shadow-lg py-4 rounded-2xl w-full font-black text-white hover:scale-[1.02] active:scale-95 transition-all">
                Selesai Membaca
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Tafsir;
