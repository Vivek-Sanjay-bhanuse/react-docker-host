// GalleryPage.jsx
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../../Components/User/Navbar/Navbar";
import Footer from "../../Components/User/Footer/Footer";
import DonateVolunteerCTA from "../../Components/User/DonateVolunteerCTA/DonateVolunteerCTA";
import base_url from "../../Config";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import galleryHeroBg from "../../assets/images/Homepage/gallery-hero-bg.jpg";
import galleryHeroCard from "../../assets/images/Homepage/gallery-hero-card.png";

import {
  FaHeart,
  FaUsers,
  FaCamera,
  FaHandsHelping,
  FaLightbulb,
  FaFolderOpen,
} from "react-icons/fa";

const categories = [
  { id: "all", label: "All", icon: <FaCamera /> },
  { id: "events", label: "Events", icon: <FaUsers /> },
  { id: "activities", label: "Activities", icon: <FaHandsHelping /> },
  { id: "campaigns", label: "Campaigns", icon: <FaLightbulb /> },
  { id: "team", label: "Media Team", icon: <FaHeart /> },
  { id: "others", label: "Others", icon: <FaFolderOpen /> },
];

const categoryMap = {
  events: "events",
  event: "events",

  activities: "activities",
  activity: "activities",

  campaigns: "campaigns",
  campaign: "campaigns",

  media: "team",
  team: "team",

  other: "others",
  others: "others",

  "": "others",
  null: "others",
  undefined: "others",
};

export default function GalleryPage() {
  const [dynamicSlides, setDynamicSlides] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSlide, setActiveSlide] = useState(null);

  const filteredSlides =
    activeCategory === "all"
      ? dynamicSlides
      : dynamicSlides.filter((item) => item.category === activeCategory);

  /* -------------------------------------------------------
      Reset activeSlide when category is empty or slides change
  ------------------------------------------------------- */
  useEffect(() => {
    if (filteredSlides.length === 0) {
      setActiveSlide(null);
    } else {
      setActiveSlide(filteredSlides[0]);
    }
  }, [filteredSlides]);
  // keep as you had

  /* -------------------------------------------------------
      FETCH GALLERY DATA
  ------------------------------------------------------- */
  const fetchGallery = async () => {
    try {
      const response = await fetch(`${base_url}api/gallery/get`, {
        method: "POST",
      });
      const json = await response.json();

      if (json.status) {
        const mapped = json.data.map((g) => {
          const rawCat = g.category ? g.category.toLowerCase() : "others";
          const mappedCat = categoryMap[rawCat] || "others";

          return {
            id: g.id,
            src: `${base_url}public/${g.image}`,
            title: g.title,
            category: mappedCat,
            caption: g.name,
          };
        });

        setDynamicSlides(mapped);
        if (mapped.length > 0) setActiveSlide(mapped[0]);
      }
    } catch (error) {
      console.error("Error loading gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // breakpoints config reused in Swiper props
  const breakpoints = {
    640: { slidesPerView: 2.1 },
    1024: { slidesPerView: 3.1 },
    1280: { slidesPerView: 3.4 },
  };

  // Determine a safe loopedSlides value (must be >= visible slides for smooth wrap)
  const maxVisible =
    filteredSlides.length >= 4 ? 4 : Math.max(1, filteredSlides.length);
  // choose loopedSlides at least equal to filteredSlides.length or a sensible minimum
  const loopedSlides = Math.max(filteredSlides.length, 5);

  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden">
        <img
          src={galleryHeroBg}
          alt="Empathy Foundation gallery background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

        <div className="relative z-10 container mx-auto px-6 lg:px-10 py-20 md:py-24 mt-14">
          <div className="flex flex-col lg:flex-row items-center gap-12 mt-5">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col ml-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Moments of <br /> Empathy
              </h1>

              <p className="mt-6 text-lg text-gray-200 max-w-xl">
                A visual journey of our events, campaigns & healing moments.
              </p>

              <div className="mt-12 flex flex-wrap gap-8">
                {[
                  { num: "1", label: "Visual Journey" },
                  { num: "2", label: "Awareness" },
                  { num: "3", label: "Healing Moments" },
                ].map((step) => (
                  <div key={step.num} className="text-center min-w-[90px]">
                    <div className="w-20 h-20 rounded-full border-[5px] border-[#e25a1d] bg-white/95 shadow-lg flex items-center justify-center">
                      <span className="text-3xl font-extrabold text-[#e25a1d]">
                        {step.num}
                      </span>
                    </div>
                    <p className="mt-3 text-white">{step.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-xl rounded-[32px] overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30">
                <img
                  src={galleryHeroCard}
                  alt="Group at empathy event"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY SECTION ================= */}
      <section className="py-16 bg-gradient-to-br from-white via-[#eef2f7] to-white relative">
        <div className="container mx-auto px-6 relative z-10">
          {/* CATEGORY TABS */}
          <div className="flex justify-center mb-12 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/60 w-full max-w-3xl">
              <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-center overflow-x-auto scrollbar-hide py-1">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-3 rounded-xl text-sm font-semibold relative transition-all whitespace-nowrap ${activeCategory === cat.id ? "text-white" : "text-gray-700"
                      }`}
                  >
                    {activeCategory === cat.id && (
                      <motion.div
                        layoutId="activeGalleryTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#FF5733] to-[#FF8C33] rounded-xl shadow-inner"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {cat.icon} {cat.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* SWIPER */}
          <Swiper
            key={`${activeCategory}-${filteredSlides.length}`}
            loop={filteredSlides.length > 1}
            loopedSlides={loopedSlides}
            centeredSlides
            grabCursor
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            speed={900}
            spaceBetween={filteredSlides.length >= 3 ? -260 : -80}
            slidesPerView={1.4}
            breakpoints={breakpoints}
            className="max-w-6xl mx-auto pb-8"
            onSlideChange={(swiper) => {
              const newIndex = swiper.realIndex;
              const current = filteredSlides[newIndex];
              if (current) setActiveSlide(current);
            }}
          >
            {filteredSlides.map((item) => (
              <SwiperSlide key={item.id}>
                {({ isActive, isPrev, isNext }) => {
                  const scaleClass = isActive
                    ? "scale-100"
                    : isPrev || isNext
                      ? "scale-80"
                      : "scale-70";

                  const imageClass = isActive
                    ? "brightness-110 scale-[1.03]"
                    : isPrev || isNext
                      ? "brightness-90"
                      : "brightness-60";

                  return (
                    <motion.div className={`relative mx-auto ${scaleClass}`}>
                      <div
                        className={`rounded-3xl overflow-hidden border ${isActive ? "border-white/40" : "border-white/10"
                          }`}
                      >
                        <div className="w-full h-80 overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${imageClass}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                }}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ================= ACTIVE SLIDE TEXT ================= */}

          {/* SHOW ONLY IF activeSlide EXISTS */}
          {activeSlide && (
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mt-4"
            >
              <span className="inline-block bg-[#f47058] text-white px-7 py-2 rounded-full text-base font-semibold mb-1">
                {activeSlide.category.toUpperCase()}
              </span>

              <h2 className="text-3xl font-bold text-gray-800">
                {activeSlide.title}
              </h2>
            </motion.div>
          )}
        </div>
      </section>

      <DonateVolunteerCTA />
      <Footer />
    </>
  );
}
