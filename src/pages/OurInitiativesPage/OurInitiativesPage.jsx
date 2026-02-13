// OurInitiativesPage.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navbar from "../../Components/User/Navbar/Navbar";
import InitiativesList from "../../Components/User/InitiativesList/InitiativesList";
import DonateVolunteerCTA from "../../Components/User/DonateVolunteerCTA/DonateVolunteerCTA";
import Footer from "../../Components/User/Footer/Footer";

// ⬇️ Use your actual image paths here
import InitiativesHeroBg from "../../assets/images/Homepage/initiatives-bg.jpg";
import InitiativesHeroCard from "../../assets/images/Homepage/initiatives-card.jpg";

export default function OurInitiativesPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section – same style as About hero */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden">
        {/* Background image */}
        <img
          src={InitiativesHeroBg}
          alt="Empathy Foundation initiatives background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-10 py-14 md:py-24 ml-6 mt-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16 mt-4">
            {/* LEFT: text + 3 steps */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col justify-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Our 
                <br></br>
                Initiatives
              </h1>

              <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 font-medium max-w-xl leading-relaxed">
                From awareness drives and counseling camps to community
                outreach, each initiative is designed to make mental health
                support accessible, safe, and stigma-free.
              </p>

              {/* 3 numbered steps / pillars */}
              <div className="mt-12 flex flex-wrap gap-8 md:gap-10">
                {[
                  { num: "1", title: "Awareness", subtitle: "Campaigns" },
                  { num: "2", title: "Counseling", subtitle: "Clinics" },
                  { num: "3", title: "Community", subtitle: "Outreach" },
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
                    <p className="mt-3 text-sm md:text-base font-semibold text-white leading-tight">
                      {step.title}
                      <br />
                      {step.subtitle}
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
              className="w-full lg:w-1/2 flex justify-center lg:h-[380px] mt-25"
            >
              <div className="relative w-full max-w-xl rounded-[32px] overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30 mt-8">
                <img
                  src={InitiativesHeroCard}
                  alt="Volunteers and participants during an Empathy initiative"
                  className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[380px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <InitiativesList />
      <DonateVolunteerCTA />
      <Footer />
    </>
  );
}
