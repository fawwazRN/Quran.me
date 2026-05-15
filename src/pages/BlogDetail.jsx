import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  User,
  Bookmark,
  Share2,
  Moon,
  Sun,
  BookOpen,
} from "lucide-react";
import { blogData } from "../data/blogData";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // Cari blog berdasarkan slug
  const blog = blogData.find((b) => b.slug === slug);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 p-6 min-h-screen text-center">
        <BookOpen size={48} className="mb-4 text-slate-300" />
        <h2 className="mb-2 font-bold text-slate-800 dark:text-white text-xl">
          Artikel Tidak Ditemukan
        </h2>
        <p className="mb-6 text-slate-500">
          Maaf, artikel yang Anda cari tidak tersedia.
        </p>
        <Link
          to="/blog"
          className="bg-emerald-500 px-6 py-3 rounded-2xl font-bold text-white text-sm">
          Kembali ke Blog
        </Link>
      </div>
    );
  }

  // Ambil 3 artikel terkait (selain artikel ini)
  const relatedPosts = blogData.filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <div className="mx-auto max-w-4xl">
        {/* HERO IMAGE */}
        <div className="relative w-full h-[50vh]">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent" />

          {/* Floating Back Button */}
          <button
            onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
            className="top-6 left-6 z-20 absolute flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 shadow-lg backdrop-blur-sm px-4 py-2 rounded-full font-bold text-slate-700 dark:text-white text-sm hover:scale-105 transition-all">
            <ArrowLeft size={18} />
            Kembali
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="top-6 right-6 z-20 absolute bg-white/80 dark:bg-slate-900/80 shadow-lg backdrop-blur-sm p-3 rounded-full text-slate-600 dark:text-emerald-400 hover:scale-110 transition-all">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* CONTENT AREA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 relative -mt-20 px-6 md:px-0">
          <div className="bg-white dark:bg-slate-900 shadow-xl p-8 md:p-12 border border-gray-100 dark:border-slate-800 rounded-[2.5rem]">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase">
                {blog.category}
              </span>
              <div className="flex items-center gap-2 font-medium text-slate-400 text-xs">
                <Clock size={14} />
                {blog.readTime}
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-8 font-black text-slate-800 dark:text-white text-2xl md:text-4xl leading-tight">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex justify-between items-center mb-8 pb-6 border-gray-100 dark:border-slate-800 border-b">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-emerald-500 rounded-full w-12 h-12 font-bold text-white text-lg">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-white">
                    {blog.author}
                  </p>
                  <p className="text-slate-400 text-xs">{blog.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 p-2 rounded-full text-slate-500 hover:text-emerald-500 transition-colors">
                  <Bookmark size={18} />
                </button>
                <button className="bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 p-2 rounded-full text-slate-500 hover:text-emerald-500 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Article Body - Render HTML */}
            <div
              className="dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed prose prose-slate"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* RELATED POSTS */}
          <div className="mt-12 mb-12">
            <h3 className="mb-6 font-black text-slate-800 dark:text-white text-xl">
              Artikel Lainnya
            </h3>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                  <div className="bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-lg border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all">
                    <div className="h-32 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-700 dark:text-white text-sm line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
