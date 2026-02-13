// DonatePage.jsx - HERO + STYLED FORM SECTION
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/User/Navbar/Navbar";
import Footer from "../../Components/User/Footer/Footer";
import DonateVolunteerSection from "./DonationVolunteerSection";

import blogHeroBg from "../../assets/images/Homepage/events-bg.jpg";      // background image
import blogHeroCard from "../../assets/images/Homepage/donationcard.jpg";

export default function DonatePage() {
  // default tab
  const [activeTab, setActiveTab] = useState("donate");

  const location = useLocation();

  // detect ?tab=volunteer
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get("tab");

      if (tab === "volunteer" || tab === "donate") {
        setActiveTab(tab);
      }
    } catch (err) {
      console.log("Query param parse error:", err);
    }
  }, [location.search]);

  return (
    <>
      <Navbar />

      {/* PREMIUM HERO - SAME STYLE AS ABOUT PAGE */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden">
        {/* Background image */}
        <img
          src={blogHeroBg}
          alt="Empathy Foundation donation background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark left-to-right gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-10 py-20 md:py-24 mt-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16 mt-5">

            {/* LEFT: Text + 3 steps */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col justify-center mt-5 ml-5"
            >
              {/* ⭐ DONATION PAGE HEADING */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Make an Impact.
                <br />
                Support a Life.
              </h1>

              {/* ⭐ DONATION PAGE DESCRIPTION */}
              <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 font-medium max-w-xl leading-relaxed">
                Your contribution fuels healing, provides mental healthcare access,
                and creates hope for those who are struggling. Even a small act of giving
                can transform someone’s entire journey.
              </p>

              {/* ⭐ 3 Steps — Now Donation-Themed */}
              <div className="mt-12 flex flex-wrap gap-8 md:gap-10">
                {[
                  { num: "1", label: "Choose an Amount" },
                  { num: "2", label: "Make Your Donation" },
                  { num: "3", label: "Create Real Impact" },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex flex-col items-center text-center min-w-[90px]"
                  >
                    <div className="w-20 h-20 md:w-22 md:h-22 rounded-full border-[5px] border-[#e25a1d] bg-white/95 shadow-lg flex items-center justify-center">
                      <span className="text-2xl md:text-3xl font-extrabold text-[#e25a1d]">
                        {step.num}
                      </span>
                    </div>
                    <p className="mt-3 text-sm md:text-base font-semibold text-white leading-tight max-w-[140px]">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Image card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-xl rounded-[36px] overflow-hidden bg-white/15 backdrop-blur-sm shadow-2xl border border-white/25">
                <img
                  src={blogHeroCard}
                  alt="Empathy Foundation donation support"
                  className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TOGGLE + FORM AREA */}
      {/* <section className="relative py-32 bg-gradient-to-b from-[#F8FAFC] to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 opacity-[0.16] bg-[radial-gradient(circle,_#cbd5f5_1px,_transparent_1px)] [background-size:18px_18px]" />

          <motion.div
            className="absolute -left-20 top-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#0EA5E9]/18 via-[#0EA5E9]/8 to-transparent blur-3xl"
            animate={{ y: [0, 26, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute -right-16 bottom-0 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FF5733]/18 via-[#FF5733]/8 to-transparent blur-3xl"
            animate={{ y: [0, -26, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#1E3A8A]/10"
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex justify-center mb-16">
            <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-2xl p-2 inline-flex border border-[#1E3A8A]/15">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("donate")}
                className={`px-12 py-5 rounded-full text-xl font-bold transition-all duration-500 flex items-center gap-3 ${
                  activeTab === "donate"
                    ? "bg-gradient-to-r from-[#FF5733] to-[#e04e2d] text-white shadow-xl"
                    : "text-[#1E3A8A] hover:text-[#0EA5E9]"
                }`}
              >
                Donate
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("volunteer")}
                className={`px-12 py-5 rounded-full text-xl font-bold transition-all duration-500 flex items-center gap-3 ${
                  activeTab === "volunteer"
                    ? "bg-gradient-to-r from-[#0EA5E9] to-[#1E3A8A] text-white shadow-xl"
                    : "text-[#1E3A8A] hover:text-[#FF5733]"
                }`}
              >
                Volunteer
              </motion.button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "donate" ? (
                <motion.div
                  key="donate"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6 }}
                >
                  <DonationForm />
                </motion.div>
              ) : (
                <motion.div
                  key="volunteer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6 }}
                >
                  <VolunteerForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section> */}

      <DonateVolunteerSection />

      <Footer />
    </>
  );
}
