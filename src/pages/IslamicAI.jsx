import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  User,
  Trash2,
  Sparkles,
  Moon,
  Sun,
  BookHeart,
  Mic2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { sendMessageToAI, clearChat } from "../features/aiSlice";

const IslamicAI = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.ai);
  const [input, setInput] = useState("");
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // Ref untuk auto-scroll ke bawah saat ada pesan baru
  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    dispatch(sendMessageToAI(input.trim()));
    setInput("");
  };

  const handleQuickAction = (text) => {
    if (loading) return;
    dispatch(sendMessageToAI(text));
  };

  // Fungsi parsing sederhana untuk bold/italic (markdown-like)
  const formatText = (text) => {
    // Bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Newline to break
    formatted = formatted.replace(/\n/g, "<br />");
    return formatted;
  };

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <div className="flex flex-col flex-1 mx-auto p-4 md:p-6 w-full max-w-4xl">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30 shadow-lg p-2.5 rounded-2xl text-white">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
                Islamic AI
              </h1>
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Asisten Islami Pintar
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* --- QUICK ACTIONS --- */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gap-3 grid grid-cols-2 md:grid-cols-4 mb-6">
            {[
              {
                label: "Buat Khutbah Jumat",
                icon: BookHeart,
                text: "Buatkan teks khutbah Jumat singkat tentang pentingnya sholat berjamaah",
              },
              {
                label: "Ide Ceramah",
                icon: Mic2,
                text: "Berikan ide dan poin utama untuk ceramah tentang sabar dalam menghadapi ujian",
              },
              {
                label: "Tanya Fiqih",
                icon: Sparkles,
                text: "Jelaskan tata cara sholat tahajud yang benar menurut sunnah",
              },
              {
                label: "Tafsir Ayat",
                icon: BookHeart,
                text: "Jelaskan tafsir surat Al-Asr ayat 1-3",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(item.text)}
                className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 hover:shadow-lg p-4 border border-gray-100 hover:border-emerald-300 dark:border-slate-800 dark:hover:border-emerald-700 rounded-2xl text-center transition-all">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <item.icon size={18} />
                </div>
                <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300">
                  {item.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* --- CHAT AREA --- */}
        <div className="flex flex-col flex-1 bg-white dark:bg-slate-900 shadow-xl mb-4 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden">
          {/* Chat Messages Container */}
          <div className="flex-1 space-y-4 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <Bot
                  size={48}
                  className="mb-4 text-slate-200 dark:text-slate-700"
                />
                <h3 className="mb-2 font-bold text-slate-800 dark:text-white">
                  Assalamualaikum
                </h3>
                <p className="max-w-xs text-slate-400 text-sm">
                  Saya siap membantu menjawab pertanyaan seputar Islam, membuat
                  khutbah, atau materi ceramah.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                    {/* Avatar AI */}
                    {msg.role === "assistant" && (
                      <div className="flex justify-center items-center bg-linear-to-br from-emerald-500 to-teal-600 shadow rounded-full w-8 h-8 text-white shrink-0">
                        <Bot size={16} />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-4 rounded-3xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-emerald-500 text-white rounded-br-lg"
                          : "bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-lg border border-gray-100 dark:border-slate-700"
                      }`}>
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatText(msg.content),
                        }}
                      />
                    </div>

                    {/* Avatar User */}
                    {msg.role === "user" && (
                      <div className="flex justify-center items-center bg-slate-200 dark:bg-slate-700 rounded-full w-8 h-8 text-slate-600 dark:text-slate-200 shrink-0">
                        <User size={16} />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start gap-3">
                    <div className="flex justify-center items-center bg-linear-to-br from-emerald-500 to-teal-600 shadow rounded-full w-8 h-8 text-white">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 rounded-3xl rounded-tl-lg">
                      <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </AnimatePresence>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-gray-100 dark:border-slate-800 border-t">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan seputar Islam..."
                  className="bg-white dark:bg-slate-800 p-4 pr-12 border border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 w-full dark:text-white text-sm transition-all resize-none"
                  rows="1"
                  style={{ minHeight: "50px", maxHeight: "120px" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 shadow-emerald-500/30 shadow-lg p-4 rounded-2xl text-white active:scale-95 transition-all disabled:cursor-not-allowed">
                <Send size={20} />
              </button>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(clearChat())}
                  className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 p-4 rounded-2xl text-white active:scale-95 transition-all">
                  <Trash2 size={20} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicAI;
