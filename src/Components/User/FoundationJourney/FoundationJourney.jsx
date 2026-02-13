// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaHeart,
  FaHandsHelping,
  FaHandHoldingMedical,
  FaLightbulb,
} from "react-icons/fa";

const journeySteps = [
  {
    year: "2016",
    title: "The Beginning",
    subtitle: "Foundation Established",
    description:
      "A small group of compassionate hearts came together to fight mental health stigma and make emotional support accessible to all.",
    icon: <FaHeart className="text-3xl" />,
    gradient: "from-rose-100 via-white to-rose-50",
    accent: "#f47058",
  },
  {
    year: "2018",
    title: "Healing Hands",
    subtitle: "Counselling Programs Launched",
    description:
      "Introduced free counselling services and safe spaces where people could finally speak without fear or judgment.",
    icon: <FaHandsHelping className="text-3xl" />,
    gradient: "from-sky-100 via-white to-sky-50",
    accent: "#0EA5E9",
  },
  {
    year: "2020",
    title: "Stronger Together",
    subtitle: "Partner Hospitals Joined",
    description:
      "Forged life-changing partnerships with leading mental health institutions to bring professional care to the most vulnerable.",
    icon: <FaHandHoldingMedical className="text-3xl" />,
    gradient: "from-slate-100 via-white to-slate-50",
    accent: "#2d365b",
  },
  {
    year: "2023",
    title: "Light of Hope",
    subtitle: "Nationwide Impact",
    description:
      "Thousands of lives transformed through awareness campaigns, outreach programs, and unwavering community support.",
    icon: <FaLightbulb className="text-3xl" />,
    gradient: "from-emerald-100 via-white to-emerald-50",
    accent: "#10b981",
  },
];

export default function FoundationJourney() {
  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-blue-50/40 to-white">
      {/* BG Dots */}
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#b9c5d6_1.3px,transparent_1.3px)] [background-size:14px_14px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        {/* Section Heading - Updated to match Core Team heading style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2d365b]">
            Our Journey of <span className="text-[#2d365b]">Hope</span>
          </h2>

          {/* Underline Animation */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#f47058] to-[#2d365b] mx-auto rounded-full mt-4"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-[#475569] text-base md:text-lg max-w-3xl mx-auto"
          >
            A journey of compassion, care, and courage — together we are
            building a world filled with understanding, support, and mental
            wellness.
          </motion.p>
        </motion.div>

        {/* Timeline Items */}
        <div className="relative max-w-6xl mx-auto space-y-20">
          {journeySteps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`flex items-center 
                  ${isLeft ? "flex-row" : "flex-row-reverse"} 
                  max-md:flex-col max-md:text-center gap-10`}
              >
                {/* Card */}
                <div
                  className={`max-md:w-full w-7/12 
                    ${isLeft ? "pr-10 max-md:pr-0" : "pl-10 max-md:pl-0"}`}
                >
                  <motion.div
                    whileHover={{
                      y: -12,
                      scale: 1.04,
                      boxShadow: "0 35px 80px rgba(0,0,0,0.22)",
                    }}
                    className={`relative bg-gradient-to-br ${step.gradient} rounded-3xl p-10 shadow-xl border border-white/60 backdrop-blur-2xl`}
                  >
                    {/* Year in background */}
                    {/* <span className="absolute font-black text-gray-300 opacity-40 right-6 top-0 select-none text-[90px] max-sm:text-[55px]">
                      {step.year}
                    </span> */}
                    <span
                      className="absolute font-black text-gray-300 opacity-40 
  max-md:static max-md:block max-md:mx-auto max-md:mt-12 
  right-6 top-0 select-none 
  text-[90px] max-sm:text-[60px] max-md:text-[70px] leading-none text-center"
                    >
                      {step.year}
                    </span>

                    {/* Floating Icon */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute -top-8 left-12 max-md:left-1/2 max-md:-translate-x-1/2"
                    >
                      <div
                        className="w-18 h-18 rounded-full flex items-center justify-center text-white border-[4px] border-white shadow-xl"
                        style={{ backgroundColor: step.accent }}
                      >
                        {step.icon}
                      </div>
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: step.accent }}
                    >
                      {step.subtitle}
                    </p>
                    <p className="mt-4 text-gray-700">{step.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
