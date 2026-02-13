// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import base_url from "../../../Config";
// const initiatives = [
//   {
//     tag: "Awareness",
//     title: "Mental Health First Aid",
//     description:
//       "Training thousands to recognize and respond to mental health crises with compassion and confidence.",
//     image:
//       "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1080&auto=format&fit=crop",
//     category: "Awareness Program",
//     accent: "#f47058", // Rose Accent
//   },
//   {
//     title: "Safe Spaces for Women",
//     description:
//       "Creating judgment-free zones with counselling, legal aid, and emotional support for women.",
//     image:
//       "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1080&auto=format&fit=crop",
//     category: "Women Empowerment",
//     accent: "#0EA5E9", // Blue Accent
//   },
//   {
//     title: "Youth Resilience Program",
//     description:
//       "Helping children and teens build emotional strength through workshops and creative therapy.",
//     image:
//       "https://images.unsplash.com/photo-1535982337055-9f0aec0d9658?q=80&w=1080&auto=format&fit=crop",
//     category: "Child & Adolescent",
//     accent: "#10b981", // Green Accent
//   },
//   {
//     tag: "Recovery",
//     title: "Addiction Recovery Network",
//     description:
//       "Supporting individuals and families on the path to recovery with therapy and community.",
//     image:
//       "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1080&auto=format&fit=crop",
//     category: "Recovery Support",
//     accent: "#8B5CF6", // Violet Accent
//   },
//   {
//     title: "Community Healing Circles",
//     description:
//       "Bringing people together to share stories, heal collectively, and end mental health silence.",
//     image:
//       "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1080&auto=format&fit=crop",
//     category: "Community Building",
//     accent: "#f59e0b", // Amber Accent
//   },
//   {
//     tag: "Workplace Wellness",
//     title: "Corporate Wellness Partnership",
//     description:
//       "Helping workplaces foster mental well-being through training and employee support systems.",
//     image:
//       "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1080&auto=format&fit=crop",
//     category: "Workplace Wellness",
//     accent: "#2d365b", // Dark Blue Accent
//   },
// ];

export default function InitiativesList() {
  const [initiatives, setInitiatives] = useState([]);

  const fetchInitiatives = async () => {
    try {
      const response = await fetch(`${base_url}api/initiative/get`, {
        method: "POST",
      });

      const json = await response.json();

      if (json.status) {
        // Add a random accent color for each initiative
        const colors = [
          "#f47058",
          "#0EA5E9",
          "#10b981",
          "#8B5CF6",
          "#f59e0b",
          "#2d365b",
        ];

        const updated = json.data.map((item, index) => ({
          ...item,
          accent: colors[index % colors.length], // auto-color
        }));

        setInitiatives(updated);
      }
    } catch (error) {
      console.error("Error fetching initiatives:", error);
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      {/* 🚀 Floating Decorative Background Elements (Copied from FoundersTrustees) */}
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
      {/* END Background Elements */}

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* 🌟 Section Header (Style adapted from FoundersTrustees) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2d365b]">
            Our <span className="text-[#f47058]">Key</span> Initiatives
          </h2>

          {/* Enhanced Underline (Copied from FoundersTrustees) */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#0EA5E9] to-[#f47058] mx-auto rounded-full mt-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[#475569] text-base md:text-lg max-w-2xl mx-auto"
          >
            Programs designed to listen, support, and bring about positive
            change in our communities.
          </motion.p>
        </motion.div>
        {/* END Section Header */}

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12  max-w-7xl mx-auto">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, type: "spring", stiffness: 300 },
              }}
              className="group relative"
            >
              {/* Animated Glow Border */}
              <motion.div
                className="absolute -inset-1.5 rounded-[1.7rem] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-md opacity-0  transition-opacity duration-700"
                style={{
                  background: `linear-gradient(to right, ${initiative.accent}80, ${initiative.accent}ff, ${initiative.accent}80)`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, delay: index * 0.1 }}
              />

              {/* Card Container - Glassmorphism Effect */}
              <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <motion.img
                    src={`${base_url}public/${initiative.image}`}
                    alt={initiative.title_name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0EA5E9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section - FIXED HEIGHT & DECORATIVE BACKGROUND */}
                <div className="px-6 py-3 md:px-7 md:py-3 relative flex flex-col justify-between flex-grow">
                  {/* Decorative Background Drawing (Abstract Wavy SVG) */}
                  <motion.div
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.25 }}
                    viewport={{ once: true }}
                    style={{ color: initiative.accent }}
                  >
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 200"
                      preserveAspectRatio="none"
                    >
                      {/* Abstract wave path */}
                      <path
                        d="M0,80 Q100,20 200,80 T400,80 L400,200 L0,200 Z"
                        fill="currentColor"
                      />
                      {/* Abstract circle path */}
                      <circle
                        cx="350"
                        cy="50"
                        r="20"
                        fill="currentColor"
                        opacity="0.8"
                      />
                      <circle
                        cx="50"
                        cy="180"
                        r="10"
                        fill="currentColor"
                        opacity="0.3"
                      />
                    </svg>
                  </motion.div>

                  {/* Category Badge - Relocated and Restyled */}
                  <div className="relative z-10 mb-3 mt-1">
                    <span
                      className="inline-block text-xs font-bold uppercase px-3 py-1 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: initiative.accent + "20",
                        color: initiative.accent,
                        border: `1px solid ${initiative.accent}40`,
                      }}
                    >
                      {initiative.category}
                    </span>
                  </div>

                  {/* Title - Justified */}
                  <h3
                    className="text-xl md:text-2xl font-bold text-[#2d365b] group-hover:text-[#f47058] 
                                transition-colors duration-300 mb-1 line-clamp-2 min-h-[56px] relative z-10 mb-3"
                  >
                    {initiative.title_name}
                  </h3>

                  {/* Description - Justified */}
                  <div className="min-h-[72px] mb-1 relative z-10 mb-3">
                    <p
                      className="text-[#475569] leading-relaxed text-sm md:text-base 
                                  line-clamp-3 text-justify"
                    >
                      {initiative.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Accent Border */}
                <motion.div
                  className="h-1.5 bg-gradient-to-r from-[#f47058] to-[#0EA5E9] "
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  style={{ originX: 0 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
