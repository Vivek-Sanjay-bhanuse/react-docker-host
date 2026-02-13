/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import image1 from "../../../assets/images/Homepage/back1.jpeg";
import image2 from "../../../assets/images/Homepage/contact-hero-bg.png";
import image3 from "../../../assets/images/Homepage/aboutback.jpg";
import { Link } from "react-router-dom";

const slidesConst = [
  {
    id: 1,
    title: "You're Not Alone.",
    subtitle:
      "Every emotion matters. Healing begins when someone listens with care. We are here to walk this path with you.",
    img: image2,
  },
  {
    id: 2,
    title: "Wellness Begins with Awareness",
    subtitle:
      "Support, empathy, and understanding can change someone’s entire world. Meaningful change starts with a single step.",
    img: image3,
  },
  {
    id: 3,
    title: "Hope. Healing. Humanity.",
    subtitle:
      "Together we break the stigma and build emotionally healthy communities where everyone feels safe to speak.",
    img: image1,
  },
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const len = slidesConst.length;

  // timings
  const holdMs = 9000; // how long a slide stays visible
  const fadeMs = 800; // fade in/out duration (ms)

  const autoRef = useRef(null);

  // start / restart auto cycle
  const startAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setIndex((s) => (s + 1) % len);
    }, holdMs);
  };

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // manual navigation (resets auto cycle)
  const goNext = () => {
    setIndex((s) => (s + 1) % len);
    startAuto();
  };
  const goPrev = () => {
    setIndex((s) => (s - 1 + len) % len);
    startAuto();
  };

  const current = slidesConst[index];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-8xl">
        <div className="relative flex flex-col md:flex-row items-stretch min-h-[70vh] md:min-h-[80vh] overflow-hidden">
          {/* ------------------------------------------------------------------ */}
          {/* LEFT: TEXT PANEL */}
          {/* ------------------------------------------------------------------ */}

          {/* DESKTOP LEFT ARROW: visible on md+; positioned next to text content */}
          <button
            aria-label="Previous slide"
            onClick={goPrev}
            className="
              hidden md:flex
              absolute top-1/2 -translate-y-1/2 z-40
              /* align near text panel on larger screens */
              left-1 md:left-[1%] lg:left-[1%] xl:left-[1%]

              w-10 h-10 md:w-12 md:h-12
              rounded-full
              bg-gradient-to-br from-[#2d365b] via-[#3c476f] to-[#2d365b]
              hover:from-[#3c476f] hover:via-[#4b5682] hover:to-[#3c476f]
              flex items-center justify-center
              shadow-lg shadow-black/40
              transition-all duration-300 backdrop-blur-md
            "
          >
            <FaChevronLeft className="text-white text-base md:text-lg" />
          </button>

          <div className="relative z-10 md:w-3/5 flex items-center py-16 md:py-0 px-6 md:px-12 lg:px-20">
            <div className="w-full max-w-2xl mx-auto md:ml-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id + "-text"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: fadeMs / 1000, ease: "easeOut" }}
                >
                  <span className="inline-block py-1 px-3 rounded-full bg-[#e2e8f0] text-[#2d365b] text-sm font-semibold mb-6 tracking-wide border border-[#cbd5e1]">
                    MENTAL WELLNESS MATTERS
                  </span>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#2d365b] tracking-tight">
                    {current.title}
                  </h1>

                  <p className="mt-6 text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-lg">
                    {current.subtitle}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link to="/about">
                      <button className="px-8 py-3.5 rounded-full bg-[#2d365b] text-white font-medium text-lg hover:bg-[#1b2442] transition-colors shadow-lg shadow-[#0f172a]/20 flex items-center gap-2">
                        Start Healing <span>&rarr;</span>
                      </button>
                    </Link>

                    <Link to="/about">
                      <button className="px-8 py-3.5 rounded-full border-2 border-[#2d365b] text-[#2d365b] font-medium text-lg hover:bg-[#e2e8f0] transition-colors">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* RIGHT: IMAGE PANEL (fade instead of slide) */}
          {/* ------------------------------------------------------------------ */}
          <div className="relative md:w-4/5 h-[300px] md:h-auto">
            {/* Wedge shape (unchanged) */}
            <div className="hidden md:block absolute -left-24 top-0 h-full w-48 bg-gradient-to-br from-white via-[#eef2f7] to-white -skew-x-12 origin-right z-20 pointer-events-none" />

            {/* Slider container */}
            <div className="absolute inset-0 overflow-hidden">
              {/* ▼ Gradient BACKGROUND (keeps shape same — sits below image) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d365b] via-[#3c476f] to-[#2d365b] z-0" />

              {/* ▼ Fade Image Animation */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id + "-img"}
                  src={current.img}
                  alt={current.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: fadeMs / 1000, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-right z-10"
                />
              </AnimatePresence>

              {/* Mobile overlay for readability */}
              <div className="absolute inset-0 bg-[#0f172a]/20 mix-blend-multiply md:hidden z-20" />
            </div>

            {/* RIGHT ARROW (always visible) */}
            <button
              aria-label="Next slide"
              onClick={goNext}
              className="
                absolute top-1/2 -translate-y-1/2 z-40
                right-3 md:right-6 lg:right-10

                w-9 h-9 md:w-12 md:h-12
                rounded-full
                bg-gradient-to-br from-[#2d365b] via-[#3c476f] to-[#2d365b]
                hover:from-[#3c476f] hover:via-[#4b5682] hover:to-[#3c476f]
                flex items-center justify-center
                shadow-lg shadow-black/40
                transition-all duration-300 backdrop-blur-md
              "
            >
              <FaChevronRight className="text-white text-sm md:text-lg" />
            </button>

            {/* MOBILE LEFT ARROW: visible on small screens only; placed at image's left */}
            <button
              aria-label="Previous slide"
              onClick={goPrev}
              className="
                md:hidden
                absolute top-1/2 -translate-y-1/2 z-40
                left-3

                w-8 h-8
                rounded-full
                bg-gradient-to-br from-[#2d365b] via-[#3c476f] to-[#2d365b]
                flex items-center justify-center
                shadow-md shadow-black/30
                transition-all duration-200
              "
            >
              <FaChevronLeft className="text-white text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
