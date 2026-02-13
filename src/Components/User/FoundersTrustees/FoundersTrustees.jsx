// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaUserTie } from "react-icons/fa";
import FounderImage from "../../../assets/images/Homepage/Founder.jpg";

const members = [
  {
    name: "Dr. Hemant Sonanis",
    role: "Founder & Chairman",
    image: FounderImage,
  },
];

export default function FoundersTrustees() {
  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
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
            Founders & <span className="text-[#2d365b]">Trustees</span>
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
            The compassionate leaders guiding our mission forward
          </motion.p>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid place-items-center max-w-6xl mx-auto ">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Gradient Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2d365b] to-[#2d365b] rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>

              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  {member.image ? (
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2d365b] to-[#1E3A8A] flex items-center justify-center">
                      <FaUserTie className="text-white text-6xl opacity-80" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Name and Role */}
                <div className="px-6 py-3 text-center">
                  <motion.h3
                    className="text-2xl font-bold text-[#2d365b] mb-1"
                    whileHover={{ color: "#2d365b" }}
                    transition={{ duration: 0.3 }}
                  >
                    {member.name}
                  </motion.h3>
                  <p className="text-[#f47058] font-semibold text-base">
                    {member.role}
                  </p>
                </div>

                {/* Bottom Progress Bar */}
                <div className="h-1 bg-gradient-to-r from-[#2d365b] via-[#2d365b] to-[#2d365b] bg-[length:200%_100%] animate-gradient-x" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
