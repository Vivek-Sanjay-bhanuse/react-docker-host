// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FaHeartbeat, FaHospitalUser, FaUserFriends, FaRegHandshake } from "react-icons/fa";

const metrics = [
  {
    label: "Lives Transformed",
    value: 25000,
    icon: <FaHeartbeat className="text-4xl" />,
    glowColor: "#FF5733",
    gradient: "from-[#FF5733] to-[#FF8A65]",
  },
  {
    label: "Partner Hospitals",
    value: 30,
    icon: <FaHospitalUser className="text-4xl" />,
    glowColor: "#0EA5E9",
    gradient: "from-[#0EA5E9] to-[#5CD2E9]",
  },
  {
    label: "Active Volunteers",
    value: 1200,
    icon: <FaUserFriends className="text-4xl" />,
    glowColor: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#B49FFB]",
  },
  {
    label: "Support Programs",
    value: 50,
    icon: <FaRegHandshake className="text-4xl" />,
    glowColor: "#10B981",
    gradient: "from-[#10B981] to-[#34D399]",
  },
];

export default function ImpactMetrics() {
  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">

      {/* 🎯 SAME BACKGROUND FROM CORE TEAM SECTION */}
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

      <div className="container mx-auto px-6 relative z-10">

        {/* ⭐ Section Heading (matched exactly to Core Team style) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2d365b]">
            Our <span className="text-[#2d365b]">Impact</span> in Numbers
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "140px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#f47058] to-[#2d365b] rounded-full mx-auto mt-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 text-[#475569] text-base md:text-lg max-w-3xl mx-auto"
          >
            Every number represents a milestone of healing, support & hope.
          </motion.p>
        </motion.div>

        {/* 📊 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {metrics.map((metric, index) => (
            <MetricOrbCard key={index} metric={metric} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function MetricOrbCard({ metric, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = metric.value;
    const duration = 1800;
    const step = end / (duration / 18);

    const timer = setInterval(() => {
      start += step;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 18);

    return () => clearInterval(timer);
  }, [isInView, metric.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      whileHover={{ y: -10, scale: 1.03 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* 🟢 Soft Glow Backlight */}
      <motion.div
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-all"
        style={{
          background: `radial-gradient(circle at center, ${metric.glowColor}35, transparent 70%)`,
        }}
      />

      {/* Glass Card */}
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl p-10 shadow-xl border border-white/30 overflow-hidden">

        {/* Light Gradient on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-10 group-hover:opacity-20`} />

        {/* Icon with rounded background */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
            style={{
              background: `linear-gradient(135deg, ${metric.glowColor}dd, ${metric.glowColor}88)`
            }}
          >
            {metric.icon}
          </div>
        </motion.div>


        {/* Number */}
        <h3 className="text-4xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#2d365b] bg-clip-text text-transparent">
          {count.toLocaleString()}+
        </h3>

        {/* Label */}
        <p className="mt-4 text-lg font-semibold text-[#1E3A8A]/90">
          {metric.label}
        </p>

        {/* Decorative Wave (same as you requested to keep) */}
        <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill={metric.glowColor + "20"} d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,170.7C960,203,1056,245,1152,250.7C1248,256,1344,224,1392,208L1440,192V0H0Z" />
        </svg>

      </div>
    </motion.div>
  );
}
