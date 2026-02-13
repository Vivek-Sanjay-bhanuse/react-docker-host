// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import base_url from "../../../Config"; // Adjust the import path as needed

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch approved testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${base_url}api/feedback/approved`);
        const result = await response.json();

        if (result.status && result.data) {
          setTestimonials(result.data);
        } else {
          setError("Failed to fetch testimonials");
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Error loading testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide every 5 seconds (only if there are testimonials)
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Function to get user initial
  const getInitial = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Function to generate gradient based on index
  const getGradient = (index) => {
    const gradients = [
      "from-[#f47058] to-[#2d365b]",  // Orange → Deep Blue
      "from-[#2d365b] to-[#7883ae]",  // Deep Blue → Soft Lavender Blue
      "from-[#7883ae] to-[#f47058]",  // Lavender Blue → Orange
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="animate-pulse text-4xl md:text-5xl font-extrabold text-[#2d365b]">
              Loading Testimonials...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#f47058]">
              {error}
            </div>
            <p className="mt-4 text-[#475569]">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#2d365b]">
              No Testimonials Available
            </div>
            <p className="mt-4 text-[#475569]">Check back later for testimonials.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      
      {/* Floating Decorative Background Circles */}
      <motion.div
        className="absolute top-16 left-8 w-24 h-24 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-12 right-12 w-28 h-28 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-[#f47058]/5"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-fit text-4xl md:text-5xl font-extrabold text-[#2d365b] text-center"
        >
          Voices of Hope

          {/* Shining Underline */}
          <div className="relative mx-auto mt-4 h-[6px] w-44 bg-gradient-to-r 
                        from-transparent via-[#2d365b] to-transparent rounded-full opacity-90">
            <div className="absolute left-1/2 top-1/2 w-20 h-[5px] -translate-x-1/2 -translate-y-1/2 bg-[#2d365b] blur-md opacity-60 rounded-full" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r 
                            from-transparent via-white/60 to-transparent animate-pulse-slow" />
          </div>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-[#475569] text-lg md:text-xl text-center max-w-3xl mx-auto"
        >
          Real stories from real people whose lives were touched by compassion.
        </motion.p>

        {/* Testimonial Carousel */}
        <div className="max-w-6xl mx-auto mt-16 relative">
          
          {/* Main Testimonial Card */}
          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="group relative bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden"
            >
              
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(currentIndex)}/5 opacity-60`} />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm"
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
              />

              <div className="relative px-8 py-12 md:px-16 md:py-16">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  
                  {/* Left Side - User Avatar & Info */}
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="relative"
                    >
                      {/* User Avatar with Gradient Border */}
                      <div className={`w-32 h-32 rounded-full p-2 bg-gradient-to-r ${getGradient(currentIndex)} shadow-2xl`}>
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                          <span className={`text-4xl font-bold bg-gradient-to-r ${getGradient(currentIndex)} bg-clip-text text-transparent`}>
                            {getInitial(testimonials[currentIndex].name)}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* User Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center mt-6"
                    >
                      <h3 className="text-2xl font-bold text-[#2d365b] mb-1">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className={`text-lg font-semibold bg-gradient-to-r ${getGradient(currentIndex)} bg-clip-text text-transparent`}>
                        {testimonials[currentIndex].designation}
                      </p>
                    </motion.div>
                  </div>

                  {/* Right Side - Testimonial Message */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="relative">
                        {/* Large Quote Icon Background */}
                        <FaQuoteLeft className={`absolute -top-8 -left-4 text-8xl opacity-5 ${getGradient(currentIndex).includes('f47058') ? 'text-[#f47058]' : 'text-[#2d365b]'}`} />
                        
                        <p className="text-[#475569] text-xl md:text-2xl leading-relaxed relative z-10">
                          {testimonials[currentIndex].feedback}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${getGradient(currentIndex)}`}
                  key={currentIndex}
                />
              </div>
            </motion.div>

            {/* Navigation Arrows - Enhanced */}
            <button
              onClick={prevTestimonial}
              className="absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 
                         bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center 
                         shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110
                         border border-gray-200 group"
            >
              <FaChevronLeft className="text-[#2d365b] text-lg group-hover:text-[#f47058] transition-colors" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 
                         bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center 
                         shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110
                         border border-gray-200 group"
            >
              <FaChevronRight className="text-[#2d365b] text-lg group-hover:text-[#f47058] transition-colors" />
            </button>
          </div>
        </div>

        {/* Enhanced Dots Indicator */}
        <div className="flex justify-center gap-4 mt-16">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all duration-300 rounded-full relative overflow-hidden ${
                index === currentIndex
                  ? `w-16 h-3 bg-gradient-to-r ${getGradient(index)} shadow-lg`
                  : "w-3 h-3 bg-[#2d365b]/30 hover:bg-[#2d365b]/60"
              }`}
            >
              {index === currentIndex && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute inset-0 bg-white/30"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Enhanced Trust Badge - Fully Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-10 sm:mt-16 px-4"
        >
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4
                       bg-white/80 backdrop-blur-sm border border-gray-200
                       rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 
                       shadow-lg sm:shadow-xl hover:shadow-2xl
                       transition-all duration-300 hover:scale-[1.03] cursor-pointer w-full max-w-md mx-auto"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r 
                         ${getGradient(currentIndex)} flex items-center justify-center flex-shrink-0`}
            >
              <FaQuoteLeft className="text-white text-base sm:text-lg" />
            </div>

            {/* Text */}
            <span className="text-[#2d365b] font-semibold sm:font-bold text-sm leading-snug sm:text-lg text-center sm:text-left">
              Trusted by Hundreds of Families & Individuals
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}