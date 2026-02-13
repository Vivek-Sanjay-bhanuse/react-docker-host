/* eslint-disable no-unused-vars */
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Aboutimg from "../../../assets/images/logo/empathy_image_old-removebg-preview.png";
import BackgroundImage from "../../../assets/images/Homepage/back2.jpeg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// ✅ Local images
import Img1 from "../../../assets/images/Homepage/back1.jpeg";
import Img2 from "../../../assets/images/Homepage/back2.jpeg";
import Img3 from "../../../assets/images/Homepage/appointmentcard.png";
import Img4 from "../../../assets/images/Homepage/donationcard.jpg";
import Img5 from "../../../assets/images/Homepage/aboutback.jpg";

export default function AboutFoundation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const slides = [
    { id: 1, src: Img1 },
    { id: 2, src: Img2 },
    { id: 3, src: Img3 },
    { id: 4, src: Img4 },
    { id: 5, src: Img5 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Counter Animation Hook
  const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;
      let start = null;
      const step = (time) => {
        if (!start) start = time;
        const progress = Math.min((time - start) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return count;
  };

  const years = useCountUp(12);
  const lives = useCountUp(28750);
  const partners = useCountUp(42);

  return (
    <section
      ref={ref}
      className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-[#2d365b] text-center"
        >
          About Empathy Foundation
          {/* Premium Shining Underline */}
          <div
            className="relative mx-auto mt-4 h-[6px] w-44 
                          bg-gradient-to-r from-transparent via-[#2d365b] to-transparent 
                          rounded-full opacity-90"
          >
            {/* Center Glow */}
            <div
              className="absolute left-1/2 top-1/2 w-20 h-[5px]
                            -translate-x-1/2 -translate-y-1/2
                            bg-[#2d365b] blur-md opacity-60 rounded-full"
            />

            {/* Premium Shimmer Animation */}
            <div
              className="absolute inset-0 rounded-full 
                            bg-gradient-to-r from-transparent via-white/60 to-transparent 
                            animate-pulse-slow"
            />
          </div>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-14 mt-20 items-center">
          {/* ✅ Swiper Section */}
          {/* ✅ Swiper Section */}
          <section className="py-16">
            <Swiper
              direction="vertical"              // move top ↕ bottom
              centeredSlides                    // keep active slide in center
              rewind={true}                     // after last → back to first
              grabCursor
              modules={[Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              speed={900}
              slidesPerView={3}                 // ✅ center + 2 side slides
              spaceBetween={-120}               // ✅ overlap like horizontal design
              className="h-[460px] max-w-md mx-auto pb-8" // ✅ height controls how much side cards show
            >
              {slides.map((item) => (
                <SwiperSlide key={item.id}>
                  {({ isActive, isPrev, isNext }) => {
                    const scaleClass = isActive
                      ? "scale-100"
                      : isPrev || isNext
                        ? "scale-90"
                        : "scale-75";

                    const imageClass = isActive
                      ? "brightness-110 scale-[1.03]"
                      : isPrev || isNext
                        ? "brightness-100"
                        : "brightness-60";

                    // ✅ opacity control
                    const opacityClass = isActive
                      ? "opacity-100"
                      : isPrev || isNext
                        ? "opacity-100"
                        : "opacity-80";

                    // ✅ blur control
                    // ✅ blur control (≈40% blur for side images)
                    const blurClass = isActive
                      ? "blur-0"
                      : "blur-[3px]";   // ✅ visually ~40% blur


                    return (
                      <motion.div
                        className={`relative mx-auto transition-transform duration-500 ${scaleClass}`}
                      >
                        <div className="rounded-3xl overflow-hidden border border-white/20">
                          <div className="w-full h-80 overflow-hidden">
                            <img
                              src={item.src}
                              alt="Empathy Foundation gallery"
                              className={`w-full h-full object-cover transition-all duration-500 ${imageClass} ${opacityClass} ${blurClass}`}
                              loading="lazy"
                            />

                          </div>
                        </div>
                      </motion.div>
                    );
                  }}

                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* ✅ Text Section (unchanged) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center lg:text-left"
          >
            <p className="text-3xl md:text-4xl font-bold text-[#2d365b] mb-6">
              Spreading Compassion, Hope & Healing
            </p>

            <p className="text-[#475569] text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 text-justify">
              Originating from the belief that mental health support goes beyond clinical spaces,
              Empathy Foundation focuses on community-driven mental well-being. We promote awareness,
              education, and accessible support services while working to break stigma and empower individuals
              to lead healthier, more fulfilling lives.
            </p>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-10">
              {[{ num: years, label: "Years" }, { num: lives, label: "Lives Helped" }, { num: partners, label: "Partners" }].map((s, i) => (
                <div key={i} className="text-center">
                  {/* Smaller on mobile, larger on bigger screens */}
                  <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2d365b] leading-tight">
                    {s.num}+
                  </h4>
                  {/* Also slightly smaller on mobile */}
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold text-[#475569]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>  

            <div className="mt-12">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 bg-[#2d365b] hover:bg-[#1b2442] text-white px-8 py-4 rounded-full transition"
              >
                Discover Our Journey →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
