// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearchPlus, FaVideo } from "react-icons/fa";

// Categories
const categories = ["All", "Event Photos", "Awareness Campaigns", "Media Coverage Videos"];

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // store item clicked

  const API_URL = "http://localhost:5000/api/gallery"; // replace with backend endpoint

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setGallery(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute filtered items based on selected category
  const filteredItems = selectedCategory === "All"
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);


  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-primary"
        >
          Gallery
        </motion.h2>

        <p className="text-textgray max-w-2xl mx-auto mt-3">
          Explore our journey through events, awareness activities and media stories.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-sm rounded-lg font-semibold border transition ${selectedCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-accent text-primary hover:bg-secondary hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl h-52 bg-accent animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Gallery Content */}
        {/* Gallery Content */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative cursor-pointer group"
                onClick={() => setLightbox(item)}
              >
                {/* IMAGE / VIDEO THUMBNAIL */}
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="rounded-xl w-full h-52 object-cover shadow-lg"
                  />
                ) : (
                  <div className="relative rounded-xl w-full h-52 overflow-hidden shadow-lg bg-gray-800">
                    <video className="w-full h-full object-cover" muted>
                      <source src={item.url} type="video/mp4" />
                    </video>
                    <FaVideo className="absolute text-white text-4xl top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2 opacity-80" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
        transition flex items-center justify-center">
                  <FaSearchPlus className="text-white text-3xl" />
                </div>

                {/* Title */}
                {item.title && (
                  <p className="mt-3 text-primary font-semibold">{item.title}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}


        {/* No Results */}
        {!loading && filteredItems.length === 0 && (
          <p className="text-gray-500 mt-10">No media found for this category.</p>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur flex justify-center items-center z-[999]"
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
                className="max-w-4xl mx-auto p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {lightbox.type === "image" ? (
                  <img src={lightbox.url} className="rounded-xl w-full max-h-[80vh] object-contain" />
                ) : (
                  <video controls className="rounded-xl w-full max-h-[80vh]">
                    <source src={lightbox.url} type="video/mp4" />
                  </video>
                )}

                <p className="text-white text-center mt-4 text-lg font-semibold">
                  {lightbox.title}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
