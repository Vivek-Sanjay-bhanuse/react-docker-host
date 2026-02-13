// NewsTab.jsx - MODAL IS NOW FULLY SCROLLABLE
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaNewspaper, FaGlobe } from "react-icons/fa";

export default function NewsTab({ news }) {
  const [selectedNews, setSelectedNews] = useState(null);

  return (
    <>
      {/* Cards - 40/60 Split */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto mb-4">
        {news.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            whileHover={{ y: -16, scale: 1.02 }}
            viewport={{ once: true }}
            className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 hover:border-[#0EA5E9]/40 transition-all duration-500"
          >
            {/* 40% Image */}
            <div className="relative h-64 md:h-72 overflow-hidden">
              <img
                src={article.image || "/assets/images/news-placeholder.jpg"}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/80 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <FaNewspaper /> {article.source}
              </div>
            </div>

            {/* 60% Content */}
            <div className="p-8">
              <h3 className="text-2xl font-extrabold text-[#1E3A8A] mb-4 leading-tight line-clamp-2 group-hover:text-[#0EA5E9] transition-colors duration-300">
                {article.title}
              </h3>

              <div className="space-y-3 text-[#64748B] mb-6">
                <p className="flex items-center gap-3 text-sm">
                  <FaGlobe className="text-[#0EA5E9]" />
                  <span className="font-medium">{article.organization}</span>
                </p>
                <p className="flex items-center gap-3 text-sm">
                  <FaCalendarAlt className="text-[#FF5733]" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </p>
                <p className="flex items-center gap-3 text-sm">
                  <FaMapMarkerAlt className="text-[#1E3A8A]" />
                  <span>{article.location}</span>
                </p>
              </div>

              <p className="text-[#64748B] leading-relaxed line-clamp-3 mb-8">
                {article.short}
  </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNews(article)}
                className="w-full bg-gradient-to-r from-[#FF5733] to-[#e04e2d] text-white font-bold py-3.5 rounded-full shadow-xl hover:shadow-[#FF5733]/50 transition-all duration-300"
              >
                View Details →
              </motion.button>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* FULLY SCROLLABLE MODAL - FIXED! */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-5 right-5 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
              >
                <FaTimes className="text-[#1E3A8A] text-xl" />
              </button>

              {/* 40% Fixed Image */}
              <div className="h-64 md:h-80 flex-shrink-0 overflow-hidden">
                <img
                  src={selectedNews.image || "/assets/images/news-placeholder.jpg"}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 60% Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-[#1E3A8A]/30">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-6 leading-tight">
                  {selectedNews.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-[#64748B] mb-8">
                  <p className="flex items-center gap-3">
                    <FaGlobe className="text-[#0EA5E9]" />
                    <strong>Organization:</strong> {selectedNews.organization}
                  </p>
                  <p className="flex items-center gap-3">
                    <FaCalendarAlt className="text-[#FF5733]" />
                    <strong>Date:</strong> {new Date(selectedNews.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-[#1E3A8A]" />
                    <strong>Location:</strong> {selectedNews.location}
                  </p>
                  <p className="flex items-center gap-3">
                    <FaNewspaper className="text-[#0EA5E9]" />
                    <strong>Source:</strong> {selectedNews.source}
                  </p>
                </div>

                {/* Scrollable Summary */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#1E3A8A]/10">
                  <h4 className="text-xl font-bold text-[#1E3A8A] mb-4">Summary</h4>
                  <div className="max-h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#1E3A8A]/30">
                    <p className="text-[#64748B] text-base leading-relaxed whitespace-pre-wrap">
                      {selectedNews.summary || selectedNews.short}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}