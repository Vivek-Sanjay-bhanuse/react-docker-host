// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import base_url from "../../../Config";
import { useState, useEffect } from "react";

// const teamMembers = [
//   {
//     name: "Aarav Mehta",
//     role: "Program Coordinator",
//     image:
//       "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     name: "Priya Nair",
//     role: "Mental Health Specialist",
//     image:
//       "https://images.unsplash.com/photo-1551836026-d5c0889d1d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     name: "Rohan Deshpande",
//     role: "Community Outreach Lead",
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     name: "Ananya Sharma",
//     role: "Operations Manager",
//     image:
//       "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
//   },
// ];

export default function CoreTeamMembers() {
  const [teamMembers, setTeamMembers] = useState([]);

  // Fetch dynamic team data
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${base_url}api/team/get`);
      const json = await response.json();

      if (json.status) {
        setTeamMembers(json.data);
      }
    } catch (error) {
      console.error("Error loading team data:", error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      {/* Floating Background Elements - Consistent with previous sections */}
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
        {/* Section Heading - Consistent with previous sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2d365b]">
            Meet Our <span className="text-[#2d365b]">Core Team</span>
          </h2>

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
            Passionate hearts and brilliant minds working together to heal,
            support, and transform lives.
          </motion.p>
        </motion.div>

        {/* Enhanced Team Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Enhanced Gradient Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2d365b] via-[#f47058] to-[#2d365b] rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500" />

              {/* Main Card Container */}
              <div className="relative bg-gradient-to-br from-white to-gray-50/90 rounded-xl shadow-lg md:shadow-xl border border-white/30 backdrop-blur-sm overflow-hidden">
                {/* Enhanced Image Container */}
                <div className="relative h-64 sm:h-72 md:h-70 overflow-hidden">
                  <motion.img
                    src={
                      member.image
                        ? `${base_url}public/${member.image}`
                        : "https://via.placeholder.com/400x400?text=No+Image"
                    }
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{
                      scale: 1.08,
                      transition: { duration: 0.6, ease: "easeOut" },
                    }}
                  />

                  {/* Multi-layer Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Enhanced Content Section */}
                <div className="relative p-5 text-center bg-white/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className="relative"
                  >
                    <motion.h3
                      className="text-lg sm:text-xl font-bold text-[#2d365b] mb-2 group-hover:text-[#2d365b] transition-colors duration-400"
                      whileHover={{ scale: 1.03 }}
                    >
                      {member.name}
                    </motion.h3>
                    <motion.p
                      className="text-[#f47058] font-semibold text-sm bg-white/80 px-3 py-1.5 rounded-full inline-block shadow-sm border border-[#f47058]/20"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#f47058",
                        color: "white",
                        transition: { duration: 0.3 },
                      }}
                    >
                      {member.speciality}
                    </motion.p>
                  </motion.div>
                </div>

                {/* Animated Bottom Progress Bar */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-[#2d365b] via-[#f47058] to-[#2d365b] bg-[length:300%_100%]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: index * 0.2 + 0.7, duration: 0.8 }}
                  style={{ originX: 0 }}
                />
              </div>

              {/* Floating Particles */}
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#0EA5E9] rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#f47058] rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.5 + 0.3,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
