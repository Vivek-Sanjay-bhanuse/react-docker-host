/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import Navbar from "../../Components/User/Navbar/Navbar";
import DonateVolunteerCTA from "../../Components/User/DonateVolunteerCTA/DonateVolunteerCTA";
import Footer from "../../Components/User/Footer/Footer";
import BookAppointment from "./BookAppointment";
import AppointmentBg from "../../assets/images/Homepage/appointmentback.png"; // big background
import AppointmentCard from "../../assets/images/Homepage/appointmentcard.png"; // right card image

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      {/* HERO – image background + left content + right card */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden">
        {/* Background image */}
        <img
          src={AppointmentBg}
          alt="Empathy Foundation background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-10 py-20 md:py-28 mt-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16 mt-[40px]">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col justify-center ml-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                
                We’re here to help you feel better.
              </h1>

              <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 font-medium max-w-xl leading-relaxed">
                Your healing journey starts with a conversation. Connect with
                trusted mental-health professionals who listen, understand, and
                walk with you toward emotional well-being and clarity.
              </p>

              {/* 3 NUMBERED STEPS */}
              <div className="mt-12 flex flex-wrap gap-8 md:gap-10">
                {[
                  { num: "1", title: "Share Your", subtitle: "Details" },
                  { num: "2", title: "Choose Your", subtitle: "Slot" },
                  { num: "3", title: "Confirm Your", subtitle: "Appointment" },
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

            {/* RIGHT IMAGE CARD */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-xl rounded-[32px] overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30">
                <img
                  src={AppointmentCard}
                  alt="Empathy group session"
                  className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the page */}
      <BookAppointment />
      <DonateVolunteerCTA />
      <Footer />
    </>
  );
}
