import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sparkles,
  Highlighter,
  PenTool,
  X,
  Trophy,
  Zap,
  Flame,
  Award,
  PlayCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Target,
  PartyPopper,
  Moon,
  Sun,
  Navigation,
} from "lucide-react";

// ================= DATA =================
const tajwidData = [
  {
    id: 1,
    title: "Nun Mati & Tanwin",
    icon: Highlighter,
    color: "from-emerald-500 to-teal-600",
    description: "Hukum nun mati dan tanwin ketika bertemu huruf tertentu",
    rules: [
      {
        name: "Idgham Bighunnah",
        arabic: "إدغام بغنة",
        explanation: "Dibaca dengung dan disambung.",
        example: "مِنْ وَلِيٍّ",
        letter: "ي ن م و",
      },
      {
        name: "Iqlab",
        arabic: "إقلاب",
        explanation: "Diubah menjadi bunyi mim.",
        example: "مِنْ بَعْدِ",
        letter: "ب",
      },
      {
        name: "Izhar Halqi",
        arabic: "إظهار حلقي",
        explanation: "Dibaca jelas tanpa dengung.",
        example: "مِنْ أَنْ",
        letter: "أ ه ع ح غ خ",
      },
      {
        name: "Ikhfa Haqiqi",
        arabic: "إخفاء حقيقي",
        explanation: "Dibaca samar-samar.",
        example: "مِنْ جَانِبٍ",
        letter: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
      },
    ],
    quiz: [
      {
        question: "Hukum bacaan 'مِنْ وَلِيٍّ' adalah...",
        options: ["Izhar", "Idgham Bighunnah", "Iqlab", "Ikhfa"],
        correctIndex: 1,
        explanation:
          "Karena Nun mati bertemu Wawu (و), huruf Idgham Bighunnah.",
      },
      {
        question: "Huruf Iqlab ada berapa?",
        options: ["1", "2", "3", "5"],
        correctIndex: 0,
        explanation: "Hanya satu, yaitu Ba (ب).",
      },
      {
        question: "Hukum bacaan 'مِنْ خَيْرٍ' termasuk...",
        options: ["Idgham", "Izhar Halqi", "Ikhfa", "Iqlab"],
        correctIndex: 1,
        explanation: "Karena Kha (خ) termasuk huruf Izhar Halqi.",
      },
      {
        question: "Apa arti dari 'Ikhfa'?",
        options: ["Jelas", "Samar", "Mantul", "Dengung"],
        correctIndex: 1,
        explanation: "Ikhfa berarti menyembunyikan atau membaca samar.",
      },
      {
        question: "Huruf Idgham Bighunnah berjumlah...",
        options: ["4 huruf", "5 huruf", "6 huruf", "2 huruf"],
        correctIndex: 0,
        explanation: "Hurufnya ada 4: ي ن م و (Ya, Nun, Mim, Wawu).",
      },
      {
        question: "Contoh Iqlab yang benar adalah...",
        options: ["مِنْ جَانِبٍ", "مِنْ بَعْدِ", "مِنْ أَنْ", "قُلْ هُوَ"],
        correctIndex: 1,
        explanation: "Mim mati bertemu Ba (ب) adalah Iqlab.",
      },
      {
        question: "Jika Nun mati bertemu huruf Ta (ت), hukumnya adalah...",
        options: ["Izhar", "Idgham", "Ikhfa Haqiqi", "Qalqalah"],
        correctIndex: 2,
        explanation: "Ta termasuk dalam 15 huruf Ikhfa Haqiqi.",
      },
    ],
  },
  {
    id: 2,
    title: "Mim Mati",
    icon: PenTool,
    color: "from-violet-500 to-purple-600",
    description: "Hukum mim mati (مْ) ketika bertemu huruf tertentu",
    rules: [
      {
        name: "Idgham Mimi",
        arabic: "إدغام متماثلين",
        explanation: "Dibaca satu mim dengan dengung.",
        example: "مِنْهُمْ مَّا",
        letter: "م",
      },
      {
        name: "Ikhfa Syafawi",
        arabic: "إخفاء شفوي",
        explanation: "Dibaca samar dengan bibir tertutup.",
        example: "رَبُّهُمْ بِهِمْ",
        letter: "ب",
      },
      {
        name: "Izhar Syafawi",
        arabic: "إظهار شفوي",
        explanation: "Dibaca jelas.",
        example: "أَنْتُمْ تَحْتُونَ",
        letter: "Selain م dan ب",
      },
    ],
    quiz: [
      {
        question: "Hukum mim mati bertemu mim adalah...",
        options: ["Izhar Syafawi", "Ikhfa Syafawi", "Idgham Mimi", "Qalqalah"],
        correctIndex: 2,
        explanation: "Disebut Idgham Mimi atau Mimi Sama.",
      },
      {
        question: "Hukum bacaan 'رَبُّهُمْ بِهِمْ' adalah...",
        options: ["Idgham", "Ikhfa Syafawi", "Izhar", "Iqlab"],
        correctIndex: 1,
        explanation: "Mim mati bertemu Ba (ب) adalah Ikhfa Syafawi.",
      },
      {
        question: "Cara membaca Ikhfa Syafawi ditandai dengan bibir...",
        options: [
          "Terbuka lebar",
          "Tertutup rapat",
          "Samar/Mendekat",
          "Moncet",
        ],
        correctIndex: 2,
        explanation:
          "Bibir dalam keadaan samar atau mendekat (tidak penuh tertutup).",
      },
      {
        question: "Huruf Izhar Syafawi adalah semua huruf kecuali...",
        options: ["Alif dan Ba", "Mim dan Ba", "Jim dan Dal", "Ha dan Kha"],
        correctIndex: 1,
        explanation:
          "Izhar Syafawi terjadi jika Mim mati bertemu huruf selain Mim dan Ba.",
      },
      {
        question: "Contoh Izhar Syafawi adalah...",
        options: [
          "هُمْ بَارِزُونَ",
          "هُمْ مَّا",
          "عَلَيْهِمْ وَلَا",
          "فِي قُلُوبِهِمْ",
        ],
        correctIndex: 2,
        explanation: "Mim mati bertemu Wawu (bukan Mim atau Ba), dibaca jelas.",
      },
    ],
  },
  {
    id: 3,
    title: "Qalqalah",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
    description: "Huruf-huruf yang dibaca memantul",
    rules: [
      {
        name: "Qalqalah Kubra",
        arabic: "قلقة كبرى",
        explanation: "Memantul kuat saat waqaf (berhenti).",
        example: "الْحَقُّ",
        letter: "ق ط ب ج د",
      },
      {
        name: "Qalqalah Sugra",
        arabic: "قلقة صغرى",
        explanation: "Memantul lemah saat washal (bersambung).",
        example: "قُلْ هُوَ",
        letter: "ق ط ب ج د",
      },
    ],
    quiz: [
      {
        question: "Huruf-huruf Qalqalah ada...",
        options: ["3 huruf", "4 huruf", "5 huruf", "6 huruf"],
        correctIndex: 2,
        explanation: "Lima huruf: Qaf, Ta, Ba, Jim, Dal (قطب جد).",
      },
      {
        question: "Qalqalah Kubra terjadi saat...",
        options: [
          "Terus membaca",
          "Berhenti (Waqaf)",
          "Bernapas",
          "Tidak membaca",
        ],
        correctIndex: 1,
        explanation: "Kubra berarti besar, terjadi saat kita berhenti di ayat.",
      },
      {
        question: "Mana contoh Qalqalah Kubra?",
        options: ["قُلْ هُوَ", "الْحَقُّ", "تَبَّتْ", "الْم"],
        correctIndex: 1,
        explanation: "Al-Haqq (الْحَقُّ) berhenti di Qaf, jadi memantul kuat.",
      },
      {
        question: "Qalqalah Sugra artinya...",
        options: [
          "Memantul Besar",
          "Memantul Kecil",
          "Tidak Memantul",
          "Dengung",
        ],
        correctIndex: 1,
        explanation: "Sugra berarti kecil, pantulannya tidak sekuat Kubra.",
      },
      {
        question: "Huruf apa saja yang termasuk Qalqalah?",
        options: ["أ ب ت ث", "ق ط ب ج د", "ع غ ف ق", "س ع ص ق"],
        correctIndex: 1,
        explanation: "Hurufnya adalah Qaf, Ta, Ba, Jim, Dal.",
      },
    ],
  },
];

const videoResources = [
  {
    id: 1,
    title: "Pengenalan Tajwid Dasar",
    thumbnail: "https://img.youtube.com/vi/h8P7YJehQKM/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=h8P7YJehQKM",
    duration: "10:25",
    level: "Pemula",
  },
  {
    id: 2,
    title: "Mengenal Hukum Nun Mati",
    thumbnail: "https://img.youtube.com/vi/AJYHK0qGmOA/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=AJYHK0qGmOA",
    duration: "15:30",
    level: "Menengah",
  },
];

// ================= COMPONENTS =================

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center gap-3 bg-white dark:bg-slate-900 p-3 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm transition-colors`}>
    <div className={`p-2 rounded-2xl ${color} text-white shadow-lg`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs">{label}</p>
      <p className="font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

const BelajarTajwid = () => {
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);

  // Theme State
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // Gamification State
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(3);

  // Quiz State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (xp >= level * 100) {
      setLevel((prev) => prev + 1);
    }
  }, [xp, level]);

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

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setIsQuizMode(false);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setQuizFinished(false);
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setQuizFinished(false);
  };

  const handleAnswer = (index) => {
    if (answered || !selectedCategory) return;
    setAnswered(true);
    setSelectedAnswer(index);

    const currentQuiz = selectedCategory.quiz[currentQIndex];
    if (index === currentQuiz.correctIndex) {
      setScore((prev) => prev + 1);
      setXp((prev) => prev + 10);
    }
  };

  const nextQuestion = () => {
    if (!selectedCategory) return;
    if (currentQIndex < selectedCategory.quiz.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setQuizFinished(true);
      setXp((prev) => prev + 30);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "video":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {videoResources.map((video, index) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group block relative bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-slate-800 rounded-4xl overflow-hidden transition-all">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500 px-2 py-0.5 rounded-full font-bold text-[10px] text-white">
                      {video.level}
                    </span>
                    <span className="bg-black/50 px-2 py-0.5 rounded-full font-bold text-[10px] text-white">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {video.title}
                  </h3>
                </div>
              </motion.a>
            ))}
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tajwidData.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleOpenCategory(category)}
                  className="group cursor-pointer">
                  <div className="relative bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-6 border border-gray-100 hover:border-gray-200 dark:border-slate-800 dark:hover:border-slate-700 rounded-[2.5rem] h-full transition-all">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br ${category.color} text-white shadow-lg mb-4`}>
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <h3 className="mb-2 font-black text-slate-800 dark:text-white text-xl">
                      {category.title}
                    </h3>
                    <p className="mb-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-500 dark:text-slate-400 text-xs">
                        <Target className="w-3 h-3" /> {category.quiz.length}{" "}
                        Soal
                      </span>
                      <span
                        className={`text-sm font-bold bg-linear-to-r ${category.color} bg-clip-text text-transparent`}>
                        Pelajari →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-10 min-h-screen transition-colors duration-500">
      <div className="space-y-10 mx-auto max-w-6xl">
        {/* --- HEADER / TOP BAR --- */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-2xl text-white">
              <BookOpen size={24} />
            </div>
            <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
              Belajar Tajwid
            </h1>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* --- STATS & PROGRESS --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex md:flex-row flex-col justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 shadow-slate-200/50 dark:shadow-none p-6 border border-gray-100 dark:border-slate-800 rounded-[2.5rem]">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-800 dark:text-white text-sm">
                Level {level}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-500 text-xs">Pemula</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-full md:w-64 h-2 overflow-hidden">
              <motion.div
                className="bg-linear-to-r from-emerald-500 to-teal-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${xp % 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              {xp % 100}/100 XP ke Level {level + 1}
            </p>
          </div>

          <div className="gap-3 grid grid-cols-3 w-full md:w-auto">
            <StatCard
              icon={Zap}
              label="Total XP"
              value={xp}
              color="bg-amber-500"
            />
            <StatCard
              icon={Flame}
              label="Streak"
              value={`${streak} Hari`}
              color="bg-orange-500"
            />
            <StatCard
              icon={Award}
              label="Level"
              value={level}
              color="bg-violet-500"
            />
          </div>
        </motion.div>

        {/* --- TABS --- */}
        <div className="flex bg-gray-100 dark:bg-slate-900 mx-auto md:mx-0 p-1.5 border border-gray-100 dark:border-slate-800 rounded-3xl w-fit">
          {[
            { id: "learn", label: "Materi", icon: BookOpen },
            { id: "video", label: "Video", icon: PlayCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>

      {/* --- MODAL: DETAIL & QUIZ --- */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedCategory(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-50 dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              {/* Header Modal */}
              <div
                className={`sticky top-0 z-10 bg-linear-to-br ${selectedCategory.color} p-6 rounded-t-[2.5rem]`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm rounded-2xl w-12 h-12">
                      <selectedCategory.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-black text-white text-2xl">
                        {selectedCategory.title}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {isQuizMode
                          ? `Kuis Soal ${currentQIndex + 1}/${selectedCategory.quiz.length}`
                          : "Materi Pembelajaran"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex justify-center items-center bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 transition-colors">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content Modal */}
              <div className="p-6">
                {!isQuizMode ? (
                  /* MATERI VIEW */
                  <>
                    <div className="space-y-4">
                      {selectedCategory.rules.map((rule, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden">
                          <button
                            onClick={() =>
                              setExpandedRule(
                                expandedRule === index ? null : index,
                              )
                            }
                            className="flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 p-4 w-full transition-colors">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-8 h-8 rounded-lg bg-linear-to-br ${selectedCategory.color} flex items-center justify-center text-white font-bold text-sm`}>
                                {index + 1}
                              </span>
                              <div className="text-left">
                                <h4 className="font-bold text-slate-800 dark:text-white">
                                  {rule.name}
                                </h4>
                                <p
                                  className="font-arabic text-slate-500 dark:text-slate-400 text-sm"
                                  style={{ fontFamily: "'Amiri', serif" }}>
                                  {rule.arabic}
                                </p>
                              </div>
                            </div>
                            {expandedRule === index ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedRule === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-gray-100 dark:border-slate-700 border-t">
                                <div className="space-y-3 p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-900/30 mt-0.5 rounded-lg w-8 h-8 shrink-0">
                                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                      <h5 className="mb-1 font-bold text-slate-700 dark:text-slate-300 text-sm">
                                        Penjelasan
                                      </h5>
                                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        {rule.explanation}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-900/30 mt-0.5 rounded-lg w-8 h-8 shrink-0">
                                      <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                      <h5 className="mb-1 font-bold text-slate-700 dark:text-slate-300 text-sm">
                                        Contoh
                                      </h5>
                                      <p
                                        className="font-arabic text-emerald-700 dark:text-emerald-400 text-lg"
                                        style={{
                                          fontFamily: "'Amiri', serif",
                                        }}>
                                        {rule.example}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={startQuiz}
                      className={`w-full mt-8 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-lg bg-linear-to-r ${selectedCategory.color} hover:opacity-90 transition-opacity`}
                      whileTap={{ scale: 0.98 }}>
                      <Target className="w-5 h-5" />
                      Mulai Kuis Materi Ini
                    </motion.button>
                  </>
                ) : (
                  /* QUIZ VIEW */
                  <>
                    {!quizFinished ? (
                      <>
                        {/* Progress Dots */}
                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                          {selectedCategory.quiz.map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full transition-all ${
                                i === currentQIndex
                                  ? `bg-linear-to-br ${selectedCategory.color} w-6`
                                  : i < currentQIndex
                                    ? "bg-emerald-400 dark:bg-emerald-600"
                                    : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="bg-white dark:bg-slate-800 shadow-inner mb-6 p-6 border border-gray-100 dark:border-slate-700 rounded-3xl">
                          <h3 className="mb-6 font-bold text-slate-800 dark:text-white text-lg">
                            {selectedCategory.quiz[currentQIndex].question}
                          </h3>

                          <div className="space-y-3">
                            {selectedCategory.quiz[currentQIndex].options.map(
                              (option, index) => {
                                const isCorrect =
                                  index ===
                                  selectedCategory.quiz[currentQIndex]
                                    .correctIndex;
                                const isSelected = index === selectedAnswer;

                                let btnClass =
                                  "bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200";
                                if (answered) {
                                  if (isCorrect)
                                    btnClass =
                                      "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300";
                                  else if (isSelected && !isCorrect)
                                    btnClass =
                                      "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
                                }

                                return (
                                  <motion.button
                                    key={index}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswer(index)}
                                    disabled={answered}
                                    className={`w-full text-left p-4 rounded-2xl font-medium flex items-center justify-between transition-all ${btnClass}`}>
                                    <span>{option}</span>
                                    {answered && isCorrect && (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    )}
                                    {answered && isSelected && !isCorrect && (
                                      <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                  </motion.button>
                                );
                              },
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {answered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-50 dark:bg-slate-800 mb-4 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 text-sm">
                              <span className="font-bold text-slate-800 dark:text-white">
                                Penjelasan:{" "}
                              </span>
                              {selectedCategory.quiz[currentQIndex].explanation}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {answered && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={nextQuestion}
                            className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-950 shadow-lg py-3 rounded-2xl w-full font-bold text-white transition-colors">
                            {currentQIndex < selectedCategory.quiz.length - 1
                              ? "Soal Berikutnya"
                              : "Selesai"}
                          </motion.button>
                        )}
                      </>
                    ) : (
                      /* RESULT VIEW */
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-8 text-center">
                        <div className="mb-6">
                          {score >= selectedCategory.quiz.length / 2 ? (
                            <div className="inline-block bg-amber-100 dark:bg-amber-900/30 mb-4 p-4 rounded-full">
                              <PartyPopper className="w-16 h-16 text-amber-500 dark:text-amber-400" />
                            </div>
                          ) : (
                            <div className="inline-block bg-slate-100 dark:bg-slate-800 mb-4 p-4 rounded-full">
                              <RefreshCw className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                            </div>
                          )}
                        </div>

                        <h2 className="mb-2 font-black text-slate-800 dark:text-white text-2xl">
                          Kuis Selesai!
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                          Skor kamu:{" "}
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {score}/{selectedCategory.quiz.length}
                          </span>
                        </p>

                        <div className="inline-block bg-white dark:bg-slate-800 mb-6 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl">
                          <p className="text-slate-400 text-xs uppercase tracking-wide">
                            XP Didapat
                          </p>
                          <p className="font-black text-amber-500 dark:text-amber-400 text-3xl">
                            +{score * 10 + 30}
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={startQuiz}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 px-6 py-3 rounded-2xl font-bold text-white transition-colors">
                            <RefreshCw className="w-4 h-4" />
                            Ulangi Kuis
                          </button>
                          <button
                            onClick={() => setIsQuizMode(false)}
                            className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 transition-colors">
                            <BookOpen className="w-4 h-4" />
                            Lihat Materi
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BelajarTajwid;
