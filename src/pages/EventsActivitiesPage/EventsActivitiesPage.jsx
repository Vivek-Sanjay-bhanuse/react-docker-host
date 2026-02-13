// EventsActivitiesPage.jsx – New hero like reference
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import Navbar from "../../Components/User/Navbar/Navbar";
import Footer from "../../Components/User/Footer/Footer";
import DonateVolunteerCTA from "../../Components/User/DonateVolunteerCTA/DonateVolunteerCTA";
import EventsList from "../../Components/User/EventsList/EventsList";

// ⬇️ Update paths to your real images
import EventsHeroBg from "../../assets/images/Homepage/events-bg.jpg";
import EventsHeroCard from "../../assets/images/Homepage/events-card.png";

export default function EventsActivitiesPage() {
  return (
    <>
      <Navbar />

      {/* HERO – background image + gradient + right card + left text */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden">
        {/* Background image */}
        <img
          src={EventsHeroBg}
          alt="Empathy Foundation events background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark gradient overlay (left to right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-10 py-20 md:py-24 mt-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16 mt-5">
            {/* LEFT: Text + 3 steps */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col justify-center ml-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Events & Activities
              </h1>

              <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 font-medium max-w-xl leading-relaxed">
                Moments of healing, hope, and human connection that bring our
                mental health mission to life.
              </p>

              {/* 3 step circles */}
              <div className="mt-12 flex flex-wrap gap-8 md:gap-10">
                {[
                  { num: "1", labelTop: "Healing" },
                  { num: "2", labelTop: "Hope" },
                  { num: "3", labelTop: "Human Connection" },
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
                    <p className="mt-3 text-sm md:text-base font-semibold text-white leading-tight max-w-[110px]">
                      {step.labelTop}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: image card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-xl rounded-[32px] overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30">
                <img
                  src={EventsHeroCard}
                  alt="Speakers and participants during an Empathy event"
                  className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <EventsList />

      <section id="cta" className="scroll-mt-20">
        <DonateVolunteerCTA />
      </section>
      <Footer />
    </>
  );
}
