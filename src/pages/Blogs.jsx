import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link untuk navigasi
import { motion, AnimatePresence } from "framer-motion";
import { BookText, Moon, Sun, Search, Clock, User } from "lucide-react";
import { blogData } from "../data/blogData"; // Import data

const categories = [
  "Semua",
  "Fiqh",
  "Al-Quran",
  "Ibadah",
  "Sejarah",
  "Keluarga",
  "Motivasi",
];

const Blogs = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const filteredBlogs = blogData.filter((blog) => {
    const matchCategory =
      activeCategory === "Semua" || blog.category === activeCategory;
    const matchSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-10 min-h-screen transition-colors duration-500">
      <div className="space-y-10 mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 shadow-emerald-500/20 shadow-lg p-2.5 rounded-2xl text-white">
              <BookText size={24} />
            </div>
            <div>
              <h1 className="font-black dark:text-white text-2xl uppercase tracking-tighter">
                Islamic Blogs
              </h1>
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Bacaan Islami Pilihan
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-white dark:bg-slate-900 shadow-sm p-3 border border-gray-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-emerald-400 hover:scale-110 active:scale-95 transition-all">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex md:flex-row flex-col justify-between items-center gap-4">
          <div className="group relative w-full md:w-64">
            <Search
              className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-emerald-500 transition-colors -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari artikel..."
              className="bg-white dark:bg-slate-900 py-3 pr-4 pl-12 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 w-full font-medium dark:text-white text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-start md:justify-end gap-2 pb-2 md:pb-0 w-full md:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* BLOG GRID */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="wait">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}>
                  {/* Gunakan Link untuk membungkus kartu */}
                  <Link to={`/blog/${blog.slug}`}>
                    <div className="group flex flex-col bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none border border-gray-100 dark:border-slate-800 rounded-[2rem] h-full overflow-hidden transition-all duration-300">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="top-4 left-4 absolute">
                          <span className="bg-emerald-500 shadow-lg px-3 py-1 rounded-full font-bold text-[10px] text-white uppercase">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-6">
                        <h3 className="mb-3 font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 text-lg line-clamp-2 leading-tight transition-colors">
                          {blog.title}
                        </h3>
                        <p className="flex-grow mb-4 text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex justify-between items-center mt-auto pt-4 border-gray-100 dark:border-slate-800 border-t">
                          <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-8 h-8">
                              <User
                                size={14}
                                className="text-emerald-600 dark:text-emerald-400"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                                {blog.author}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {blog.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 font-bold text-[10px] text-slate-400">
                            <Clock size={12} />
                            {blog.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center">
                <BookText
                  size={48}
                  className="mx-auto mb-4 text-slate-200 dark:text-slate-700"
                />
                <p className="font-bold text-slate-500">
                  Tidak ada artikel ditemukan
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
