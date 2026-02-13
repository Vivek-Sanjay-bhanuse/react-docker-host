// ContactForm.jsx – Compact form with bouncing/floating background shapes
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaHeart,
  FaRegHandshake,
  FaHospitalUser,
  FaComments,
} from "react-icons/fa";
import base_url from "../../../Config";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${base_url}api/contact/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (json.status) {
        alert("Thank you! Your message has been submitted ❤️");
        reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Server error. Please try again later.");
    }
  };

  // small reusable animation props
  const floatY = {
    animate: { y: [0, -18, 0] },
    transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
  };

  const floatYSlow = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 8.5, repeat: Infinity, ease: "easeInOut" },
  };

  const rotateSquare = {
    animate: { rotate: [0, 45, 0] },
    transition: { duration: 10, repeat: Infinity, ease: "linear" },
  };

  return (
    <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden font-sans text-base leading-relaxed tracking-normal">

      {/* 🌟 Floating Decorative Background Elements (page-level) */}
      <motion.div
        className="absolute top-10 left-8 w-20 h-20 rounded-full bg-[#f47058]/12 pointer-events-none"
        {...floatY}
      />
      <motion.div
        className="absolute bottom-8 right-10 w-24 h-24 rounded-full bg-[#2d365b]/12 pointer-events-none"
        {...floatY}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#0EA5E9]/12 rounded-lg rotate-45 pointer-events-none"
        {...rotateSquare}
      />

      {/* small dots */}
      <motion.span
        className="absolute top-1/2 left-6 w-2 h-2 rounded-full bg-[#f47058]/70 pointer-events-none"
        animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-1/3 left-16 w-2 h-2 rounded-full bg-[#0EA5E9]/70 pointer-events-none"
        animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-1/4 right-24 w-2 h-2 rounded-full bg-[#2d365b]/70 pointer-events-none"
        animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 right-10 text-[#f47058]/20"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <FaHeart className="text-5xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-14 left-10 text-[#1E3A8A]/15"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <FaRegHandshake className="text-4xl" />
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Outer shell card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-[32px] bg-white shadow-xl border border-slate-100 overflow-hidden mt-4"
        >
          {/* Header strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 border-b border-slate-100 bg-[#2d365b] text-white">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-white/70">
                Contact Empathy Foundation
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-1">
                We’re here to listen and support you
              </h2>
            </div>
            <div className="text-xs md:text-sm text-white/80 flex flex-col items-start md:items-end gap-1">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                Average response time: 24–48 hours
              </span>
              <span>No judgment. Just support 💙</span>
            </div>
          </div>

          {/* Inner content: 2 cards side-by-side + full-width map */}
          <div className="px-8 md:px-10 py-10 bg-slate-50/60">
            {/* Top row: 2 cards side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* LEFT – FORM CARD (COMPACT) */}
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-7 h-full flex flex-col overflow-hidden">
                {/* BACKGROUND SHAPES for form card */}
                <motion.div
                  className="absolute -left-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
                  style={{ backgroundColor: "rgba(244,112,88,0.08)" }}
                  {...floatY}
                />
                <motion.div
                  className="absolute right-6 -bottom-6 w-24 h-24 rounded-lg pointer-events-none"
                  style={{ backgroundColor: "rgba(45,54,91,0.07)" }}
                  {...floatYSlow}
                />
                <motion.div
                  className="absolute -top-8 right-12 w-12 h-12 rounded-full pointer-events-none"
                  style={{ backgroundColor: "rgba(14,165,233,0.08)" }}
                  animate={{ y: [0, -14, 0], rotate: [0, 25, 0] }}
                  transition={{ duration: 7.2, repeat: Infinity }}
                />
                {/* Donation / Support themed icons */}
                <motion.div
                  className="absolute top-10 right-10 text-[#f47058]/20 pointer-events-none"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <FaHeart className="text-5xl" />
                </motion.div>

                <motion.div
                  className="absolute bottom-14 left-10 text-[#1E3A8A]/15 pointer-events-none"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <FaRegHandshake className="text-4xl" />
                </motion.div>

                {/* Form header accent */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-1 h-7 rounded-full bg-gradient-to-b from-[#0EA5E9] to-[#f47058]" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-[#64748B]">
                      Send a message
                    </p>
                    <h3 className="text-lg md:text-xl font-bold text-[#0f172a]">
                      Tell us how we can help
                    </h3>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 flex-1 flex flex-col relative z-10"
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Full name
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/18 transition-all text-sm"
                      />
                      {errors.name && (
                        <p className="text-[#FF5733] text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Email address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/18 transition-all text-sm"
                      />
                      {errors.email && (
                        <p className="text-[#FF5733] text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-0">
                    <label className="block text-xs font-medium text-slate-700">
                      Your message (max 200 characters)
                    </label>

                    <p className="text-[11px] text-right text-[#64748B] mt-1 mb-1">
                      {watch("message")?.length || 0}/200
                    </p>
                    <textarea
                      rows="4"
                      maxLength={200}
                      placeholder="Share what you're going through, or how you'd like to help..."
                      {...register("message", {
                        required: "Message is required",
                        maxLength: {
                          value: 200,
                          message: "Message cannot exceed 200 characters",
                        },
                      })}
                      className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 
                        focus:outline-none focus:border-[#1E3A8A] focus:ring-2 
                        focus:ring-[#1E3A8A]/18 transition-all text-sm resize-none"
                    />

                    {errors.message && (
                      <p className="text-[#FF5733] text-xs mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col gap-3 pt-2 w-full mt-auto">
                    <motion.button
                      whileHover={{
                        y: -2,
                        boxShadow: "0 10px 24px rgba(45, 54, 91, 0.35)", // adjusted shadow tint
                      }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="w-full md:w-[230px] mx-auto py-3 rounded-full 
    bg-[#2d365b] hover:bg-[#1b2442]
    text-white font-semibold text-sm md:text-base tracking-wide shadow-md 
    transition-all flex items-center justify-center gap-2"
                    >
                      Send your message
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-lg"
                      >
                        →
                      </motion.span>
                    </motion.button>

                    <p className="text-[11px] text-center text-[#64748B] max-w-xs mx-auto leading-relaxed">
                      We’ll never share your details with anyone. Your story is
                      safe with us 💙
                    </p>
                  </div>
                </form>
              </div>

              {/* RIGHT – CONTACT INFO CARD */}
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-sm p-7 md:p-8 h-full flex flex-col overflow-hidden">
                {/* BACKGROUND SHAPES */}
                <motion.div
                  className="absolute -right-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
                  style={{ backgroundColor: "rgba(45,54,91,0.06)" }}
                  {...floatYSlow}
                />
                <motion.div
                  className="absolute left-6 -bottom-8 w-24 h-24 rounded-full pointer-events-none"
                  style={{ backgroundColor: "rgba(244,112,88,0.06)" }}
                  {...floatY}
                />
                <motion.div
                  className="absolute -top-6 left-12 w-14 h-14 rounded-lg pointer-events-none"
                  style={{ backgroundColor: "rgba(14,165,233,0.07)" }}
                  animate={{ y: [0, -12, 0], rotate: [0, -20, 0] }}
                  transition={{ duration: 7.8, repeat: Infinity }}
                />

                {/* Floating icons */}
                <motion.div
                  className="absolute top-12 left-10 text-[#0EA5E9]/15 pointer-events-none"
                  animate={{ rotate: [0, 18, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <FaRegHandshake className="text-4xl" />
                </motion.div>

                <motion.div
                  className="absolute bottom-12 right-10 text-[#FF5733]/15 pointer-events-none"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <FaHospitalUser className="text-4xl" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 right-1/4 text-[#1E3A8A]/10 pointer-events-none"
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 7, repeat: Infinity }}
                >
                  <FaComments className="text-5xl" />
                </motion.div>

                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-1 h-7 rounded-full bg-gradient-to-b from-[#0EA5E9] to-[#1E3A8A]" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-[#64748B]">
                      Contact details
                    </p>
                    <h3 className="text-lg md:text-xl font-bold text-[#0f172a]">
                      Reach us directly
                    </h3>
                  </div>
                </div>

                <div className="space-y-5 flex-1 relative z-10">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-[#0EA5E9] text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-[0.16em] text-[#64748B]">
                        Address
                      </p>
                      <p className="text-sm text-[#0f172a] mt-1 leading-relaxed">
                        Sunshine Counselling and Therapy Center,
                        <br />
                        Solitaire building, First & Second floor, Keshavrao More Marg, Collage Road, Nashik-422005
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF5733]/10 flex items-center justify-center flex-shrink-0">
                      <FaPhoneAlt className="text-[#FF5733] text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-[#64748B]">
                        Phone
                      </p>
                      <p className="text-sm text-[#0f172a] mt-1">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-[#1E3A8A] text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-[0.16em] text-[#64748B]">
                        Email
                      </p>
                      <p className="text-sm text-[#0f172a] mt-1 break-words">
                        support@empathyfoundation.org
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social row */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
                  <p className="text-[11px] text-[#64748B]">
                    Follow our awareness campaigns:
                  </p>
                  <div className="flex gap-3">
                    {[
                      {
                        Icon: FaFacebookF,
                        link: "#",
                        bg: "bg-[#1877F2]/10",
                        color: "text-[#1877F2]",
                      },
                      {
                        Icon: FaInstagram,
                        link: "#",
                        bg: "bg-[#E4405F]/10",
                        color: "text-[#E4405F]",
                      },
                      {
                        Icon: FaLinkedinIn,
                        link: "#",
                        bg: "bg-[#0A66C2]/10",
                        color: "text-[#0A66C2]",
                      },
                    ].map(({ Icon, link, bg, color }, i) => (
                      <motion.a
                        key={i}
                        href={link}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center border border-slate-200 shadow-sm transition-all`}
                      >
                        <Icon size={16} className={color} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: FULL-WIDTH MAP CARD */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-10 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold tracking-[0.18em] text-[#64748B]">
                  Location
                </p>
                <span className="text-[11px] text-[#0EA5E9]">
                  View on Google Maps
                </span>
              </div>
              <div className="h-80">
                <iframe
                  title="Empathy Foundation location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                  src="https://www.google.com/maps?q=Solitaire+Building,+Keshavrao+More+Marg,+College+Road,+Nashik+422005&output=embed"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
