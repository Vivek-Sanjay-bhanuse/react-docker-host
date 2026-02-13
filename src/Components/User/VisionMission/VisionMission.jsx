// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaEye,
  FaBullseye,
  FaHeart,
  FaHandsHelping,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

export default function VisionMission() {
  return (
    <section className="relative py-14 bg-linear-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      {/* Floating Decorative Background Elements */}
      <motion.div
        className="absolute top-8 left-8 w-20 h-20 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-8 right-16 w-24 h-24 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#0EA5E9]/10 rounded-lg rotate-45"
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2d365b]">
            Our <span className="text-[#f47058]">Vision</span> &{" "}
            <span className="text-[#2d365b]">Mission</span>
          </h2>

          {/* Enhanced Underline */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#f47058] to-[#2d365b] mx-auto rounded-full mt-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[#475569] text-base md:text-lg max-w-2xl mx-auto"
          >
            Guiding principles for mental health awareness and compassionate
            support
          </motion.p>
        </motion.div>

        {/* 🔹 Vision & Mission SIDE BY SIDE (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative"
          >
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-[#2d365b] to-[#2d365b] rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden h-full">
              {/* Animated Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#2d365b]/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />

              <div className="p-6 flex items-start gap-5 relative z-10">
                {/* Enhanced Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative flex-shrink-0"
                >
                  <div className="p-3 bg-linear-to-br from-[#2d365b] to-[#2d365b]/90 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FaEye className="text-white text-2xl sm:text-3xl" />
                  </div>
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 bg-[#2d365b] rounded-xl blur-md opacity-0 group-hover:opacity-40 transition duration-500 -z-10" />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#2d365b] to-[#2d365b] bg-clip-text text-transparent">
                      Our Vision
                    </h3>
                    <motion.div
                      className="w-2 h-2 bg-[#2d365b] rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                    A world where mental health is valued, stigma is eliminated,
                    and every person has access to compassionate care and
                    emotional support.
                  </p>

                  {/* Enhanced Feature Points */}
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[
                      {
                        icon: FaHeart,
                        text: "Mental Wellness",
                        color: "#2d365b",
                      },
                      {
                        icon: FaShieldAlt,
                        text: "Safe Spaces",
                        color: "#2d365b",
                      },
                      {
                        icon: FaUsers,
                        text: "Inclusive Care",
                        color: "#2d365b",
                      },
                      {
                        icon: FaHandsHelping,
                        text: "Community",
                        color: "#2d365b",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-center gap-2 text-xs bg-white/80
                          px-3 py-2 rounded-lg border border-gray-200/60 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <item.icon
                          style={{ color: item.color }}
                          className="text-sm"
                        />
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Bottom Progress Bar */}
              <div className="h-1.5 bg-linear-to-r from-[#2d365b] via-[#2d365b] to-[#0EA5E9] bg-[length:200%_100%] animate-gradient-x" />
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.15 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative"
          >
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-[#f47058] to-[#2d365b] rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden h-full">
              {/* Animated Background Pattern */}
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#f47058]/5 rounded-full translate-y-10 -translate-x-10 group-hover:scale-150 transition-transform duration-500" />

              <div className="p-6 flex items-start gap-5 relative z-10">
                {/* Enhanced Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="relative flex-shrink-0"
                >
                  <div className="p-3 bg-linear-to-br from-[#f47058] to-[#e05a44] rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FaBullseye className="text-white text-2xl sm:text-3xl" />
                  </div>
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 bg-[#f47058] rounded-xl blur-md opacity-0 group-hover:opacity-40 transition duration-500 -z-10" />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#2d365b] to-[#f47058] bg-clip-text text-transparent">
                      Our Mission
                    </h3>
                    <motion.div
                      className="w-2 h-2 bg-[#f47058] rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1,
                      }}
                    />
                  </div>

                  <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                    To provide emotional support, professional counseling, and
                    awareness programs that empower individuals and communities
                    to thrive mentally.
                  </p>

                  {/* Enhanced Feature Points */}
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {[
                      { icon: FaHeart, text: "Support", color: "#f47058" },
                      {
                        icon: FaShieldAlt,
                        text: "Counseling",
                        color: "#f47058",
                      },
                      { icon: FaUsers, text: "Awareness", color: "#f47058" },
                      {
                        icon: FaHandsHelping,
                        text: "Empowerment",
                        color: "#f47058",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-center gap-2 text-xs bg-white/80
                          px-3 py-2 rounded-lg border border-gray-200/60 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <item.icon
                          style={{ color: item.color }}
                          className="text-sm"
                        />
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Bottom Progress Bar */}
              <div className="h-1.5 bg-linear-to-r from-[#f47058] via-[#2d365b] to-[#f47058] bg-[length:200%_100%] animate-gradient-x" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
