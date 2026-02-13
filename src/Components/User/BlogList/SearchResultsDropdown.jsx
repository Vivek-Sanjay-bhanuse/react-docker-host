// SearchResultsDropdown.jsx - FIXED WIDTH TO MATCH SEARCH BAR
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaBlog, FaNewspaper, FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";

export default function SearchResultsDropdown({
  searchQuery,
  results = [],
  onResultClick,
  onClose,
}) {
  if (!searchQuery.trim()) return null;

  const hasResults = results.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden z-50"
        style={{
          boxShadow: "0 20px 40px rgba(30, 58, 138, 0.15)",
        }}
      >
        <div className="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-[#1E3A8A]/20">
          {hasResults ? (
            results.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: "#F8FAFC" }}
                className="p-6 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-300"
                onClick={() => onResultClick(item)}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0EA5E9]/20 to-[#1E3A8A]/20 rounded-2xl flex items-center justify-center shadow-lg">
                    {item.type === "blog" ? (
                      <FaBlog className="text-[#0EA5E9] text-2xl" />
                    ) : (
                      <FaNewspaper className="text-[#FF5733] text-2xl" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Tag */}
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
                          item.type === "blog"
                            ? "bg-[#0EA5E9]/10 text-[#0EA5E9]"
                            : "bg-[#FF5733]/10 text-[#FF5733]"
                        }`}
                      >
                        {item.type === "blog" ? "Blog" : "News"}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-extrabold text-[#1E3A8A] line-clamp-1 leading-tight">
                      {item.title}
                    </h4>

                    {/* Preview */}
                    <p className="text-[#64748B] text-sm mt-2 line-clamp-2 leading-relaxed">
                      {item.description || item.short || "No preview available"}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#64748B]">
                      {item.author && (
                        <div className="flex items-center gap-2">
                          <FaUser className="text-[#0EA5E9]" />
                          <span>{item.author}</span>
                        </div>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#FF5733]" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#1E3A8A]" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-xl font-semibold text-[#64748B]">No results found</p>
              <p className="mt-2 text-base text-[#64748B]/80">Try different keywords</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}