import { motion } from "framer-motion";
import { Globe, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // SVG Kustom untuk Medsos (Karena Lucide tidak punya)
  const SocialIcons = {
    Github: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 1024 1024"
        height="22"
        width="22"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 29.4-164.7-65.9-164.7-65.9-22.3-56.8-54.3-71.9-54.3-71.9-44.4-30.3 3.3-29.7 3.3-29.7 49.1 3.3 74.9 50.4 74.9 50.4 43.7 74.8 114.6 53.2 142.5 40.7 4.5-31.7 17.1-53.3 31.1-65.6-108.3-12.4-222.2-54.1-222.2-241.3 0-53.3 19.1-97 50.3-131.2-4.5-12.4-21.8-62.3 4.9-129.5 0 0 41.2-13.2 135 50.3 39.1-10.9 81.1-16.3 122.7-16.5 41.5.2 83.6 5.6 122.8 16.5 93.6-63.5 134.7-50.3 134.7-50.3 27 67.2 9.6 117.1 5.2 129.5 31.5 34.1 50.2 77.9 50.2 131.2 0 187.5-114.1 228.7-222.7 240.8 17.5 15.1 33.1 45 33.1 90.6v134.4c0 10.2-.8 20.2 19.1 20.2 176.3-59.4 303.3-226.5 303.3-424.2 0-247.1-200.3-447.3-447.5-447.3z"></path>
      </svg>
    ),
    Instagram: (
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="22"
        width="22"
        xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  };

  return (
    <footer className="relative bg-white dark:bg-slate-950 py-12 border-gray-100 dark:border-slate-800 border-t transition-colors duration-500">
      <div className="mx-auto px-6 container">
        <div className="flex md:flex-row flex-col justify-between items-center gap-8">
          {/* Bagian Kiri: Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:text-left text-center">
            <h2 className="mb-2 font-black text-slate-800 dark:text-white text-xl tracking-tighter">
              QURAN.ME
            </h2>
            <p className="font-medium text-slate-500 dark:text-slate-400 text-sm">
              Hak Cipta &copy; {currentYear} Fawwaz Romzi Nagib.
            </p>
            <p className="font-bold text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">
              Seluruh Hak Dilindungi
            </p>
          </motion.div>

          {/* Bagian Tengah: Ucapan Terima Kasih (API) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-gray-50 dark:bg-slate-900/50 px-8 py-4 rounded-3xl">
            <span className="mb-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
              Didukung Oleh
            </span>
            <a
              href="https://equran.id"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 transition-all">
              <Globe
                size={16}
                className="text-emerald-500 group-hover:rotate-12 transition-transform"
              />
              <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 text-lg transition-colors">
                equran.id
              </span>
            </a>
          </motion.div>

          {/* Bagian Kanan: Sosial Media / Kontak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4">
            <a
              href="#"
              className="flex justify-center items-center bg-gray-100 hover:bg-emerald-500 dark:bg-slate-800 dark:hover:bg-emerald-600 rounded-2xl w-12 h-12 text-slate-600 hover:text-white dark:text-slate-400 transition-all hover:-translate-y-2">
              {SocialIcons.Github}
            </a>
            <a
              href="#"
              className="flex justify-center items-center bg-gray-100 hover:bg-emerald-500 dark:bg-slate-800 dark:hover:bg-emerald-600 rounded-2xl w-12 h-12 text-slate-600 hover:text-white dark:text-slate-400 transition-all hover:-translate-y-2">
              {SocialIcons.Instagram}
            </a>
            <a
              href="mailto:fawwaz@example.com"
              className="flex justify-center items-center bg-gray-100 hover:bg-emerald-500 dark:bg-slate-800 dark:hover:bg-emerald-600 rounded-2xl w-12 h-12 text-slate-600 hover:text-white dark:text-slate-400 transition-all hover:-translate-y-2">
              <Mail size={22} />
            </a>
          </motion.div>
        </div>

        {/* Garis Bawah & Quote kecil */}
        <div className="flex flex-col justify-center items-center mt-12 pt-8 border-gray-50 dark:border-slate-900 border-t">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="mb-4 text-emerald-500"></motion.div>
          <p className="font-medium text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
            Dibangun dengan ketelitian untuk memberikan pengalaman membaca
            Al-Qur'an terbaik secara digital.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
