// BlogNewsPage.jsx - FINAL WITH NEWS CARDS
// eslint-disable-next-line no-unused-vars
import { useState, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../Components/User/Navbar/Navbar";
import Footer from "../../Components/User/Footer/Footer";
import BlogTab from "../../Components/User/BlogList/BlogTab";
import NewsTab from "../../Components/User/BlogList/NewsTab";
import SearchResultsDropdown from "../../Components/User/BlogList/SearchResultsDropdown";
import { FaSearch } from "react-icons/fa";
import UserBlogNews from "./UserBlogNews";
import DonateVolunteerCTA from "../../Components/User/DonateVolunteerCTA/DonateVolunteerCTA";

import blogHeroBg from "../../assets/images/Homepage/blog-hero-bg.jpg";      // background image
import blogHeroCard from "../../assets/images/Homepage/blog-hero-card.jpg";  // right side card image

const SAMPLE_BLOGS = [
  {
    id: 1,
    title: "Understanding Anxiety in Modern Life",
    description: "A deep dive into triggers and coping mechanisms for anxiety.",
    author: "Dr. Sarah Chen",
    date: "2025-11-15",
    readTime: "8 min read",
    content:
      "Anxiety has become one of the most common mental health challenges...",
  },
  {
    id: 2,
    title: "Mindfulness Practices for Daily Life",
    description: "Simple techniques to reduce stress and improve focus.",
    author: "Priya Sharma",
    date: "2025-11-10",
    readTime: "6 min read",
    content: "Mindfulness is more than a buzzword...",
  },
];

const SAMPLE_NEWS = [
  {
    id: 1,
    title: "Empathy Foundation Launches Free Counseling in Rural Areas",
    image: "/assets/images/news/rural-counseling.jpg",
    date: "2025-11-20",
    source: "The Hindu",
    short:
      "New initiative brings mental health support to underserved communities.",
  },
  {
    id: 2,
    title: "National Mental Health Awareness Campaign 2025",
    image: "/assets/images/news/campaign-2025.jpg",
    date: "2025-11-18",
    source: "PTI",
    short:
      "Government partners with NGOs for nationwide mental wellness drive.",
  },
  {
    id: 3,
    title: "Sunshine Mindcare Partners with Empathy Foundation",
    image: "/assets/images/news/partnership.jpg",
    date: "2025-11-05",
    source: "Times of India",
    short:
      "New collaboration to expand mental health services across Maharashtra.",
  },
];

export default function BlogNewsPage() {
  // const [activeTab, setActiveTab] = useState("blog");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [blogs] = useState(SAMPLE_BLOGS);
  // const [news] = useState(SAMPLE_NEWS);

  // const searchResults = useMemo(() => {
  //   if (!searchQuery.trim()) return [];
  //   const q = searchQuery.toLowerCase();
  //   const blogRes = blogs
  //     .filter(
  //       (b) =>
  //         b.title.toLowerCase().includes(q) ||
  //         b.description.toLowerCase().includes(q)
  //     )
  //     .map((b) => ({ ...b, type: "blog" }));
  //   const newsRes = news
  //     .filter(
  //       (n) =>
  //         n.title.toLowerCase().includes(q) || n.short.toLowerCase().includes(q)
  //     )
  //     .map((n) => ({ ...n, type: "news" }));
  //   return [...blogRes, ...newsRes].slice(0, 8);
  // }, [searchQuery, blogs, news]);

  // const handleResultClick = (item) => {
  //   setActiveTab(item.type);
  //   setSearchQuery("");
  // };

  return (
    <>
      <Navbar />

            {/* HERO – Blog & News */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden">
        {/* Background image */}
        <img
          src={blogHeroBg}
          alt="Empathy Foundation blog and news background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark left-to-right gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-10 py-20 md:py-24 mt-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16 mt-5">
            
            {/* LEFT: Text + 3 steps */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col justify-center mt-5 ml-5"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Blog &amp;
                <br />
                News
              </h1>

              <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 font-medium max-w-xl leading-relaxed">
               Stories and updates that inspire healing, encourage awareness, and remind us that every voice matters and every journey deserves compassion.
              </p>

              {/* 3 orange steps */}
              <div className="mt-12 flex flex-wrap gap-8 md:gap-10">
                {[
                  { num: "1", label: "Healing" },
                  { num: "2", label: "Awareness" },
                  { num: "3", label: "Hopes" },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex flex-col items-center text-center min-w-[90px]"
                  >
                    <div className="w-20 h-20 md:w-22 md:h-22 rounded-full border-[5px] border-[#e25a1d] bg-white/95 shadow-lg flex items-center justify-center">
                      <span className="text-2xl md:text-3xl font-extrabold text-[#e25a1d]">
                        {step.num}
                      </span>
                    </div>
                    <p className="mt-3 text-sm md:text-base font-semibold text-white leading-tight max-w-[120px]">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Image card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-xl rounded-[36px] overflow-hidden bg-white/15 backdrop-blur-sm shadow-2xl border border-white/25">
                <img
                  src={blogHeroCard}
                  alt="Speaker at Empathy Foundation event"
                  className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Elegant Tabs */}
      {/* <section className="py-16 bg-gradient-to-b from-[#1E3A8A]/5 to-transparent">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-20">
            {["blog", "news"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className="relative pb-6 text-2xl font-bold capitalize"
              >
                <span
                  className={
                    activeTab === tab
                      ? "text-[#FF5733]"
                      : "text-[#1E3A8A] hover:text-[#0EA5E9] transition"
                  }
                >
                  {tab === "blog" ? "Stories & Insights" : "Latest News"}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="blogNewsUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0EA5E9] to-[#FF5733] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section> */}

      {/* Content */}
      {/* <AnimatePresence mode="wait">
        {activeTab === "blog" ? (
          <BlogTab key="blog" blogs={blogs} />
        ) : (
          <NewsTab key="news" news={news} />
        )}
          
      </AnimatePresence> */}

      <UserBlogNews />

      <section id="cta" className="scroll-mt-20">
              <DonateVolunteerCTA />
            </section>
      <Footer />
    </>
  );
}
