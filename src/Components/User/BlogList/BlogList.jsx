// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaShareAlt, FaSearch } from "react-icons/fa";

const categories = [
  "All",
  "Mental Health Articles",
  "Foundation News",
  "Awareness Tips",
];

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = "http://localhost:5000/api/blogs"; // update when backend ready

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Derived filteredBlogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Search Filter (just updates searchQuery)
  const handleSearch = () => {
    // Optionally, you can trigger search on input change or keep this for button click
    // No need to setFilteredBlogs, just update searchQuery
  };

  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-6">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-primary font-bold text-3xl md:text-4xl text-center"
        >
          Articles & Insights
        </motion.h2>

        <p className="text-textgray text-center max-w-2xl mx-auto mt-3">
          Explore mental health resources, awareness updates, and foundation activities.
        </p>

        {/* Filters & Search */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-lg text-sm font-semibold border transition ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-primary border-accent hover:bg-secondary hover:text-white"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-md w-full max-w-lg">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full outline-none text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="text-primary hover:text-secondary">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-52 bg-white animate-pulse rounded-xl shadow"></div>
            ))}
          </div>
        )}

        {/* Blog Cards */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl border border-accent overflow-hidden cursor-pointer"
              >
                {/* Image */}
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-6">
                  <span className="text-xs bg-secondary text-white px-3 py-1 rounded-full">
                    {blog.category}
                  </span>

                  <h3 classname="text-primary text-lg font-bold mt-3">
                    {blog.title}
                  </h3>

                  <p className="text-textgray text-sm mt-2 line-clamp-3">
                    {blog.description}
                  </p>

                  {/* Read More Link */}
                  <div className="mt-5 flex justify-between items-center">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-secondary font-semibold hover:text-primary transition text-sm"
                    >
                      Read More →
                    </Link>

                    {/* Share Button */}
                    <motion.button whileHover={{ scale: 1.2 }}>
                      <FaShareAlt className="text-primary hover:text-secondary" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredBlogs.length === 0 && (
          <p className="text-center text-gray-600 mt-12">
            No blogs match your search or category filter.
          </p>
        )}
      </div>
    </section>
  );
}
