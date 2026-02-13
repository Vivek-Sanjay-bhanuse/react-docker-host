// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHeart, FaHandsHelping } from "react-icons/fa";

export default function DonateVolunteerCTA() {
  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      {/* Floating Decorative Circles (same styling as other sections) */}
      <motion.div
        className="absolute top-14 left-10 w-20 h-20 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-14 right-14 w-24 h-24 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#7883ae]/8"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.8 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl md:text-4xl font-extrabold text-[#2d365b]"
        >
          Spread <span className="text-[#f47058]">Empathy</span> & Healing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[#475569] max-w-2xl mx-auto mt-4 text-base md:text-lg"
        >
          One act of kindness can transform lives forever.
        </motion.p>

        {/* CTA Panels - Compact Version */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 items-center gap-6 max-w-6xl mx-auto">
          {/* Donate Panel */}
          <motion.div
            whileHover={{ y: -6, scale: 1.03 }}
            className="group relative bg-white/75 backdrop-blur-lg border border-[#7883ae]/20 
             rounded-3xl p-6 text-center shadow-xl overflow-hidden"
          >
            <FaHeart
              className="absolute text-[#f47058] opacity-[0.12] text-[180px]
               top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               pointer-events-none transition-transform duration-700 
               group-hover:scale-110"
            />

            <h3 className="relative z-10 text-lg md:text-xl font-bold text-[#2d365b] mb-3">
              Donate
            </h3>

            <p className="relative z-10 text-[#475569] text-sm mb-5">
              Help us provide free mental health care.
            </p>

            <Link
              to="/donate"
              className="relative z-10 inline-block bg-gradient-to-r from-[#f47058] to-[#e05a44] 
               text-white font-semibold text-sm rounded-full shadow-md
               px-6 py-2.5 hover:scale-105 transition-all"
            >
              Donate Now
            </Link>

            {/* FIXED: bottom attached */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f47058] to-[#e05a44]" />
          </motion.div>

          {/* Center Animated Heart */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#f47058] to-[#2d365b] rounded-full shadow-xl grid place-items-center">
              <FaHeart className="text-white text-3xl" />
            </div>
          </motion.div>

          {/* Volunteer Panel */}
          <motion.div
            whileHover={{ y: -6, scale: 1.03 }}
            className="group relative bg-white/75 backdrop-blur-lg border border-[#7883ae]/20 
             rounded-3xl p-6 text-center shadow-xl overflow-hidden"
          >
            <FaHandsHelping
              className="absolute text-[#2d365b] opacity-[0.12] text-[180px]
               top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               pointer-events-none transition-transform duration-700 
               group-hover:scale-110"
            />

            <h3 className="relative z-10 text-lg md:text-xl font-bold text-[#2d365b] mb-3">
              Volunteer
            </h3>

            <p className="relative z-10 text-[#475569] text-sm mb-5">
              Give time & spread compassion.
            </p>

            <Link
              to="/donate?tab=volunteer"
              className="relative z-10 inline-block bg-gradient-to-r from-[#2d365b] to-[#1e2a4a] 
               text-white font-semibold text-sm rounded-full shadow-md
               px-6 py-2.5 hover:scale-105 transition-all"
            >
              Join Us
            </Link>

            {/* FIXED: bottom attached */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2d365b] to-[#1e2a4a]" />
          </motion.div>
        </div>

        {/* Bottom Motivational Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 text-[#2d365b] italic text-sm md:text-base"
        >
          “Together, we create ripples of hope.”
        </motion.p>
      </div>
    </section>
  );
}
