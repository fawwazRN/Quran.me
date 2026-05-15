import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import {
  Code2,
  FileText,
  Moon,
  Sun,
  Upload,
  Scan,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
  SwitchCamera,
} from "lucide-react";

const ImageToCode = () => {
  // State Mode: 'code' atau 'text'
  const [mode, setMode] = useState("code");

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Theme Effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setExtractedText(""); // Reset text
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setExtractedText("");
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Process Image with Tesseract
  const processImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(selectedImage, "eng+ind", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setExtractedText(result.data.text);
    } catch (error) {
      console.error(error);
      setExtractedText("Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset All
  const resetAll = () => {
    setSelectedImage(null);
    setExtractedText("");
    setProgress(0);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-10 min-h-screen transition-colors duration-500">
      <div className="space-y-8 mx-auto max-w-4xl">
        {/* --- HEADER --- */}
        <div className="flex md:flex-row flex-col justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-2xl text-white">
              {mode === "code" ? <Code2 size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
                Image Converter
              </h1>
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Extract Code or Text from Images
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setMode("code")}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "code"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                <Code2 size={14} />
                Code
              </button>
              <button
                onClick={() => setMode("text")}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "text"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                <FileText size={14} />
                Text
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
          {/* INPUT AREA (Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-white dark:bg-slate-900 shadow-sm p-6 border border-gray-100 dark:border-slate-800 rounded-[2.5rem]">
            <h3 className="flex items-center gap-2 mb-4 font-bold text-slate-800 dark:text-white">
              <ImageIcon size={18} className="text-emerald-500" />
              Input Gambar
            </h3>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all min-h-[300px] ${
                selectedImage
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-emerald-400"
              }`}>
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="absolute inset-0 p-4 rounded-3xl w-full h-full object-contain"
                  />
                  <button
                    onClick={resetAll}
                    className="top-4 right-4 z-10 absolute bg-red-500 hover:bg-red-600 shadow-lg p-2 rounded-full text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <div className="p-6 text-center">
                  <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-800 mx-auto mb-4 rounded-2xl w-16 h-16 text-slate-400">
                    <Upload size={32} />
                  </div>
                  <p className="mb-1 font-bold text-slate-600 dark:text-slate-300">
                    Tarik & Lepas Gambar
                  </p>
                  <p className="mb-4 text-slate-400 text-xs">atau</p>
                  <label className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-2xl font-bold text-white text-sm transition-all cursor-pointer">
                    Pilih File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Process Button */}
            {selectedImage && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={processImage}
                disabled={isLoading}
                className="flex justify-center items-center gap-2 bg-slate-900 dark:bg-white hover:opacity-90 disabled:opacity-50 mt-6 py-4 rounded-2xl w-full font-bold text-white dark:text-slate-900 transition-all">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Scanning... ({progress}%)
                  </>
                ) : (
                  <>
                    <Scan size={20} />
                    Scan Gambar
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* OUTPUT AREA (Right) - Dynamic based on Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col bg-white dark:bg-slate-900 shadow-sm p-6 border border-gray-100 dark:border-slate-800 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                {mode === "code" ? (
                  <Code2 size={18} className="text-emerald-500" />
                ) : (
                  <FileText size={18} className="text-emerald-500" />
                )}
                Hasil {mode === "code" ? "Code" : "Text"}
              </h3>
              {extractedText && (
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCopied
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200"
                  }`}>
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {isCopied ? "Tersalin!" : "Salin"}
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-emerald-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 text-right">
                    Mengenali teks...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dynamic Output Container */}
            <div className="relative flex-1 min-h-[300px]">
              {mode === "code" ? (
                // CODE VIEW (Dark Block)
                <div className="absolute inset-0 bg-slate-900 p-4 rounded-2xl overflow-auto font-mono text-emerald-100 text-sm">
                  {extractedText ? (
                    <pre className="break-words whitespace-pre-wrap">
                      {extractedText}
                    </pre>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-full text-slate-600">
                      <Code2 size={40} className="opacity-20 mb-2" />
                      <p className="text-xs">Code akan muncul di sini</p>
                    </div>
                  )}
                </div>
              ) : (
                // TEXT VIEW (Editable Area)
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Teks akan muncul di sini dan bisa diedit..."
                  className="bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full h-full text-slate-800 dark:text-white text-sm transition-all resize-none"
                  disabled={isLoading}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImageToCode;
