// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaHeart, FaHandshake, FaStar, FaHospital } from "react-icons/fa";
import Manoday from "../../../assets/images/logo/ManodayLogo.png";
import Sunshine from "../../../assets/images/logo/SunshineLogo.png";

const hospitals = [
  {
    name: "Sunshine Mindcare",
    description: "A comprehensive psychological wellness centre offering therapy, group programs, and training. An experienced multidisciplinary team and supportive learning environment, Sunshine provides compassionate, evidence-based mental healthcare for individuals, students, and families.",
    logo: Sunshine,
    link: "https://sunshine-mindcare.onrender.com/",
    specialty: "Therapy, Assessments & Psychological Training",
    color: "from-[#f47058] to-[#e05a44]",
    bgGradient: "from-[#f47058]/5 to-[#e05a44]/10"
  },
  {
    name: "Manoday Hospital",
    description:"A compassionate psychiatric centre offering accurate diagnosis, ethical treatment, and holistic emotional wellbeing. With calming consultation and therapy spaces, Manoday delivers accessible, high-quality mental healthcare rooted in empathy and community-focused healing.",
    logo: Manoday,
    link: "https://hpclsparesportal.in/Manoday_Frontend/",
    specialty: "Comprehensive Psychiatric & Psychological Care",
    color: "from-[#2d365b] to-[#1e2a4a]",
    bgGradient: "from-[#2d365b]/5 to-[#1e2a4a]/10"
  }
];

export default function PartnerHospitals() {
  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">

      {/* Floating Decorative Background Circles */}
      <motion.div
        className="absolute top-10 left-10 w-28 h-28 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-6 right-20 w-32 h-32 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-fit text-4xl md:text-5xl font-extrabold text-[#2d365b] text-center"
        >
          Our Trusted Partner Hospitals

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
          In collaboration with our partner hospitals, we ensure expert clinical care & emotional
          support for healing.
        </motion.p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mt-16">
          {hospitals.map((hospital, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Torch Light Spotlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-60
                              bg-gradient-to-b from-white/60 via-white/20 to-transparent
                              blur-2xl opacity-0 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

              {/* LOGO — Now Properly Inside Card */}
              <div className="flex justify-center mt-10">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-40 h-40 rounded-full p-3 shadow-[0_0_60px_rgba(0,0,0,0.2)]
                                  bg-gradient-to-br from-white to-gray-100 border-[6px] border-white">
                    <img
                      src={hospital.logo}
                      alt={hospital.name}
                      className="w-full h-full object-contain rounded-full"
                      style={{
                        filter: "brightness(1.08) contrast(1.15)",
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="px-8 pb-5 flex flex-col text-center mt-6">

                {/* Hospital Name */}
                <h3 className="text-2xl md:text-3xl font-bold text-[#2d365b] group-hover:text-[#f47058] transition-colors">
                  {hospital.name}
                </h3>

                {/* Specialty */}
                <div className="inline-flex items-center gap-2 mx-auto my-4 text-sm
                                bg-[#2d365b]/10 text-[#2d365b] px-4 py-2 rounded-full border border-[#2d365b]/20">
                  <FaHospital className="text-[#f47058]" />
                  {hospital.specialty}
                </div>

                {/* Description */}
                <p className="text-[#475569] text-base md:text-lg leading-relaxed flex-grow">
                  {hospital.description}
                </p>

                {/* Button */}
                <motion.a
                  href={hospital.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex justify-center items-center gap-3 bg-[#2d365b] hover:bg-[#1e2647]
                             text-white rounded-full px-8 py-3 shadow-md mt-8"
                >
                  Visit Website
                  <FaExternalLinkAlt size={14} />
                </motion.a>

                {/* Bottom Accent */}
                <div className={`h-1.5 mt-6 rounded-full bg-gradient-to-r ${hospital.color}`} />
              </div>

            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm 
                          border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
            <FaStar className="text-[#f47058]" size={20} />
            <span className="text-[#2d365b] font-semibold">
              Trusted Healthcare Partnerships Making a Difference
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
