// BlogTab.jsx - COMPACT, CLEAN & EMOTIONAL
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaTimes, FaHeart, FaShareAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

export default function BlogTab({ blogs }) {
  const [expandedId, setExpandedId] = useState(null);
  const [bookmarked, setBookmarked] = useState({});

  useEffect(() => {
    document.body.style.overflow = expandedId ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [expandedId]);

  const handleExpand = (id) => setExpandedId(id);
  const handleCollapse = () => setExpandedId(null);

  const toggleBookmark = (id) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success(bookmarked[id] ? "Removed from bookmarks" : "Saved to bookmarks!");
  };

  return (
    <>
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto mb-5">
        {blogs.map((blog) => (
          <div key={blog.id}>
            {/* Compact Card */}
            <motion.article
              layoutId={`blog-${blog.id}`}
              onClick={() => handleExpand(blog.id)}
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden cursor-pointer border border-white/30 hover:border-[#0EA5E9]/40 transition-all duration-500 h-full flex flex-col"
              whileHover={{ y: -12, scale: 1.02 }}
            >
              {/* Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-[#0EA5E9] via-[#1E3A8A] to-[#FF5733]" />

              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1E3A8A] mb-4 leading-tight line-clamp-2 group-hover:text-[#0EA5E9] transition-colors duration-500">
                  {blog.title}
                </h2>
                <p className="text-[#64748B] text-base leading-relaxed mb-6 line-clamp-3 flex-1">
                  {blog.description}
                </p>

                {/* Author + Date */}
                <div className="flex items-center gap-4 text-sm text-[#64748B] mb-8">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-[#0EA5E9]" />
                    <span className="font-medium">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#FF5733]" />
                    <span>{new Date(blog.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                {/* Smaller Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#FF5733] to-[#e04e2d] text-white font-bold text-base py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Read Full Article →
                </motion.button>
              </div>
            </motion.article>

            {/* Compact Modal - No Image */}
            <AnimatePresence>
              {expandedId === blog.id && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    onClick={handleCollapse}
                  />

                  <motion.article
                    layoutId={`blog-${blog.id}`}
                    className="fixed inset-x-4 top-20 bottom-20 md:inset-x-20 lg:inset-x-32 z-50 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-y-auto border border-white/50"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  >
                    {/* Header */}
                    <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-white/50 p-6 flex justify-between items-center z-10">
                      <button
                        onClick={handleCollapse}
                        className="w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
                      >
                        <FaTimes className="text-[#1E3A8A] text-xl" />
                      </button>
                      <div className="flex gap-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(blog.id); }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                            bookmarked[blog.id] ? "bg-[#FF5733] text-white" : "bg-white/80 hover:bg-white"
                          }`}
                        >
                          <FaHeart className="text-xl" />
                        </button>
                        <button className="w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300">
                          <FaShareAlt className="text-[#1E3A8A] text-xl" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 md:p-16 max-w-4xl mx-auto">
                      <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] mb-8 leading-tight">
                        {blog.title}
                      </h1>
                      <div className="flex items-center gap-6 text-lg text-[#64748B] mb-12">
                        <div className="flex items-center gap-3">
                          <FaUser className="text-[#0EA5E9]" />
                          <span className="font-medium">{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="text-[#FF5733]" />
                          <span>{new Date(blog.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>

                      <div className="prose prose-lg max-w-none text-[#64748B] leading-relaxed space-y-8">
                        <p className="text-xl font-medium text-[#1E3A8A]/90">{blog.description}</p>
                        {blog.content.split("\n\n").map((para, i) => (
                          <p key={i} className="text-lg">{para}</p>
                        ))}
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-white/50 p-6 text-center">
                      <button
                        onClick={handleCollapse}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF5733] to-[#e04e2d] text-white font-bold text-lg px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                      >
                        Close Article
                      </button>
                    </div>
                  </motion.article>
                </>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </>
  );
}