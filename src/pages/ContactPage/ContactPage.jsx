// ContactPage.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navbar from "../../Components/User/Navbar/Navbar";
import ContactForm from "../../Components/User/ContactForm/ContactForm";
import Footer from "../../Components/User/Footer/Footer";

import bgImage from "../../assets/images/Homepage/contact-hero-bg.png";      // background image
import cardImage from "../../assets/images/Homepage/contact-hero-card.jpg"; 


export default function ContactPage() {
  // You can later replace these URLs with your own local images if you want

  const steps = [
    { number: "1", label: "Need\nSupport" },
    { number: "2", label: "Want to\nVolunteer" },
    { number: "3", label: "Share Your\nStory" },
  ];

  return (
    <>
      <Navbar />

      {/* HERO – background image + gradient + right card + left text + 3 steps */}
      <section className="relative w-full h-[100vh] min-h-[520px] overflow-hidden">
        {/* Background image */}
        <img
          src={bgImage}
          alt="Empathy Foundation outreach"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/15" />

        {/* Main content */}
        <div className="relative z-10 h-full mt-12">
          <div className="container mx-auto h-full px-6 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10">
            {/* LEFT – text content */}
            <div className="w-full lg:w-1/2 text-white ml-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 "
              >
                Reach Out to
                <br />
                Empathy
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-base sm:text-lg lg:text-xl text-gray-100/90 max-w-xl mb-8 leading-relaxed"
              >
                Your voice matters. Whether you need support, want to volunteer,
                or simply wish to share your story — we’re here to listen.
              </motion.p>

              {/* 3 steps */}
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
            </div>

            {/* RIGHT – image card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-[42%] max-w-xl"
            >
              <div className="rounded-[32px] overflow-hidden bg-white/5 border border-white/35 shadow-2xl backdrop-blur-sm">
                <img
                  src={cardImage}
                  alt="Counseling and emotional support at Empathy Foundation"
                  className="w-full h-[260px] sm:h-[320px] md:h-[360px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-14 bg-gradient-to-b from-[#F8FAFC] to-white">
        <ContactForm />
      </section>

      <Footer />
    </>
  );
}
