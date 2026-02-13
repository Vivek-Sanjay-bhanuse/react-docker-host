// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaHandsHelping, FaChild, FaComments, FaHeart, FaUsers, FaHandHoldingHeart, FaShieldAlt } from "react-icons/fa";

const focusItems = [
  {
    title: "Mental Health",
    desc: "Supporting emotional wellbeing through safe and accessible care for all individuals.",
    icon: <FaBrain />,
    color: "from-[#f47058] to-[#e05a44]",
    gradient: "from-[#f47058]/10 to-[#e05a44]/5"
  },
  {
    title: "Counselling",
    desc: "Providing professional guidance and emotional support for individuals and families.",
    icon: <FaComments />,
    color: "from-[#2d365b] to-[#1e2a4a]",
    gradient: "from-[#2d365b]/10 to-[#1e2a4a]/5"
  },
  {
    title: "Community Awareness",
    desc: "Promoting knowledge and education to break social barriers and stigma.",
    icon: <FaHandsHelping />,
    color: "from-[#7883ae] to-[#5a6a9c]",
    gradient: "from-[#7883ae]/10 to-[#5a6a9c]/5"
  },
  {
    title: "Women & Child Support",
    desc: "Ensuring safety, development and dignity for women and children in need.",
    icon: <FaChild />,
    color: "from-[#f47058] to-[#e05a44]",
    gradient: "from-[#f47058]/10 to-[#e05a44]/5"
  },
];

export default function FocusAreas() {

  const navigate = useNavigate();

  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">

      {/* Floating Decorative Elements - Same as About Section */}
      <motion.div
        className="absolute top-10 left-10 w-28 h-28 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-6 right-20 w-32 h-32 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6">

        {/* Section Heading - Same Style as About Section */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-fit text-4xl md:text-5xl font-extrabold text-[#2d365b] text-center"
        >
          Our Focus Areas

          {/* Premium Shining Underline - Same as About Section */}
          <div className="relative mx-auto mt-4 h-[6px] w-44 
                          bg-gradient-to-r from-transparent via-[#2d365b] to-transparent 
                          rounded-full opacity-90">

            {/* Center Glow */}
            <div className="absolute left-1/2 top-1/2 w-20 h-[5px]
                            -translate-x-1/2 -translate-y-1/2
                            bg-[#2d365b] blur-md opacity-60 rounded-full" />

            {/* Premium Shimmer Animation */}
            <div className="absolute inset-0 rounded-full 
                            bg-gradient-to-r from-transparent via-white/60 to-transparent 
                            animate-pulse-slow" />
          </div>
        </motion.h2>

        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-center text-[#475569] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mt-6"
        >
          We work tirelessly to create a positive and lasting impact across key humanitarian priorities,
          ensuring every individual receives the care and support they deserve.
        </motion.p>

        {/* Enhanced Focus Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {focusItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/60 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10 p-8 text-center h-full flex flex-col">
                {/* Icon Container */}
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 0.4,
                    rotate: { duration: 0.6 }
                  }}
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  {item.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#2d365b] mb-4 group-hover:text-[#2d365b] transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#475569] leading-relaxed flex-grow text-base group-hover:text-gray-700 transition-colors duration-300">
                  {item.desc}
                </p>

                {/* Bottom Gradient Line */}
                <motion.div
                  className={`h-1.5 mt-6 rounded-full bg-gradient-to-r ${item.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
                  initial={{ width: "60%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>

              {/* Floating Particles Effect */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-[#f47058] rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-[#475569] text-lg mb-8">
            Together, we can make a difference in these critical areas
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/donate?tab=volunteer")}
            className="inline-flex items-center gap-2 bg-[#2d365b] hover:bg-[#1b2442] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <FaHandHoldingHeart className="text-[#f47058]" />
            <span>Join Our Mission</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}