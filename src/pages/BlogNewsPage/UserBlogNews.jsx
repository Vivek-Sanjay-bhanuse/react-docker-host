// UserBlogNews.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUser,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import base_url from "../../Config";
import UserBlogForm from "./UserBlogForm"; // <-- adjust path if needed

const UserBlogNews = () => {
  const [activeTab, setActiveTab] = useState("blog");
  const [viewContent, setViewContent] = useState(null);
  const viewModalRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchNews();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${base_url}api/blog/get?status=1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: 1,
        }),
      });
      const result = await response.json();
      if (result.status) setBlogs(result.data || []);
    } catch (error) {
      console.error("Blog Fetch Error:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(`${base_url}api/news/get`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.status) setNews(result.data || []);
    } catch (error) {
      console.error("News Fetch Error:", error);
    }
  };

  const cardBaseClasses = `
    relative cursor-pointer group
    bg-white/95
    rounded-xl border border-gray-100
    shadow-sm
    overflow-hidden transition-all duration-300
  `;

  const BlogTab = ({ blogs }) => (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            onClick={() => setViewContent({ ...blog, type: "blog" })}
            className={`${cardBaseClasses} p-5 relative overflow-hidden`}
          >
            {/* Card Content */}
            <div className="flex items-center justify-between mb-1">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                Blog
              </span>
              <span className="text-sm text-gray-700">
                {new Date(blog.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {blog.title}
            </h3>

            <p className="text-gray-700 font-medium text-sm mb-4 leading-relaxed line-clamp-3">
              {blog.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <FontAwesomeIcon icon={faUser} className="w-3 mr-2" />
                <span className="font-medium text-gray-700">{blog.author}</span>
              </div>

              <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Read More →
              </span>
            </div>

            {/* 🔥 Bottom Theme Border */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f47058] to-[#2d365b]" />
          </motion.div>
        ))}
      </div>
    </div>
  );

  const NewsTab = ({ news }) => (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            onClick={() => setViewContent({ ...item, type: "news" })}
            className={`${cardBaseClasses} relative overflow-hidden`}
          >
            <div className="h-44 overflow-hidden rounded-t-xl">
              <img
                src={`${base_url}public/${item.image}`}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                  News
                </span>

                <span className="text-sm text-gray-700">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-700 font-medium text-sm mb-4 leading-relaxed line-clamp-2">
                {item.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon icon={faUser} className="w-3 mr-2" />
                  <span className="font-medium text-gray-700">{item.author}</span>
                </div>

                <span className="text-green-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Read More →
                </span>
              </div>
            </div>

            {/* 🔥 Bottom Theme Border */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f47058] to-[#2d365b]" />
          </motion.div>
        ))}
      </div>
    </div>
  );

  const openAddBlog = () => {
    setEditingContent(null);
    setShowBlogForm(true);
  };

  // handle blog submit from UserBlogForm
  const handleBlogSubmit = async (payload) => {
    // payload: { title, date, author, type, description, content, image (File), ... }
    setIsSubmittingBlog(true);
    try {
      const fd = new FormData();
      fd.append("title", payload.title);
      fd.append("date", payload.date);
      fd.append("author", payload.author);
      fd.append("description", payload.description);
      fd.append("content", payload.content);
      fd.append("status", 0);

      // if (payload.image) fd.append("image", payload.image);

      const res = await fetch(`${base_url}api/blog/store`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.status) {
        await fetchBlogs();
        setShowBlogForm(false);
      } else {
        // you can surface json.message to the UI if required
        console.error("API Error:", json);
      }
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setIsSubmittingBlog(false);
    }
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      {/* Floating shapes */}
      <motion.div
        className="absolute top-8 left-8 w-20 h-20 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-8 right-16 w-24 h-24 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#0EA5E9]/10 rounded-lg rotate-45"
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Tabs row: tabs left on mobile / centered on md+; Add Blog button on the right */}
        <div className="flex items-center w-full">
          {/* Tabs wrapper: left on small screens, centered on md+ */}
          <div className="flex-1 flex justify-start md:justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-gray-200/50 max-w-full md:max-w-max">
              <div className="flex gap-2">
                {[
                  { key: "blog", label: "Blogs" },
                  { key: "news", label: "News" },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 md:px-6 py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 relative overflow-hidden ${activeTab === tab.key
                      ? "text-white"
                      : "text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50"
                      }`}
                  >
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-gradient-to-r from-[#FF5733] to-[#FF8C33] rounded-xl shadow-inner"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Add Blog button: show only on Blog tab */}
          {activeTab === "blog" && (
            <div className="flex-shrink-0 ml-3">
              <button
                onClick={openAddBlog}
                className="inline-flex items-center gap-2 bg-[#f47058] hover:bg-[#e05a44] text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all duration-200 text-sm md:text-base"
              >
                + Add Blog
              </button>
            </div>
          )}
          
        </div>

        {/* content */}
        <AnimatePresence mode="wait">
          {activeTab === "blog" ? (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <BlogTab blogs={blogs} />
            </motion.div>
          ) : (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <NewsTab news={news} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BLOG VIEW MODAL */}
      {viewContent && viewContent.type === "blog" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto pt-19 sm:pt-0">
          <div
            ref={viewModalRef}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden animate-scale-in max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => setViewContent(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-all duration-300 shadow-lg border border-[#2d365b]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            <div className="p-6 bg-white">
              <div className="mb-4 pr-8">
                <h3 className="text-xl font-bold text-[#2d365b] mb-3">
                  {viewContent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 w-4 text-[#2d365b]"
                    />
                    <span className="font-medium">{viewContent.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-2 w-4 text-[#2d365b]"
                    />
                    <span className="font-medium">
                      {new Date(viewContent.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-lg font-semibold text-[#2d365b] mb-3">
                  Description
                </h4>
                <div className="max-h-36 overflow-y-auto custom-scrollbar pr-2">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                    {viewContent.description}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-lg font-semibold text-[#2d365b] mb-3">
                  Content
                </h4>
                <div className="max-h-56 overflow-y-auto custom-scrollbar pr-2">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {viewContent.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWS VIEW MODAL */}
      {viewContent && viewContent.type === "news" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto pt-19 sm:pt-0">
          <div
            ref={viewModalRef}
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden animate-scale-in max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => setViewContent(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-all duration-300 shadow-lg border border-[#2d365b]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            <div className="w-full h-64 sm:h-72 overflow-hidden bg-gray-100">
              <img
                src={`${base_url}public/${viewContent.image}`}
                alt={viewContent.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-white">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#2d365b] mb-3">
                  {viewContent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 w-4 text-[#2d365b]"
                    />
                    <span className="font-medium">{viewContent.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-2 w-4 text-[#2d365b]"
                    />
                    <span className="font-medium">
                      {new Date(viewContent.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                  {viewContent.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog form modal */}
      <AnimatePresence>
        {showBlogForm && (
          <UserBlogForm
            content={editingContent}
            onCancel={() => setShowBlogForm(false)}
            onSubmit={handleBlogSubmit}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.28s ease-out;
        }
      `}</style>
    </section>
  );
};

export default UserBlogNews;
