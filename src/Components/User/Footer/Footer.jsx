// Footer.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import ComapanyLogo from "../../../assets/images/logo/EmpathyFoundationLogo.jpeg";
import { useState } from "react";
import CustomAlert from "../../CustomAlert/CustomAlert";
import base_url from "../../../Config";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Add state for alert just below useState hooks:
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message, duration = 3000) => {
    setAlert({ show: true, type, message, duration });
  };

  // Update form submit handler:
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return showAlert("error", "Please enter your name");
    }
    if (!designation.trim()) {
      return showAlert("error", "Please enter your designation");
    }
    if (!message.trim()) {
      return showAlert("error", "Message is required");
    }
    if (message.length > 200) {
      return showAlert("error", "Message cannot exceed 200 characters");
    }

    try {
      const response = await fetch(`${base_url}api/feedback/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          designation: designation,
          feedback: message,
          status: true, // auto approved or change to false
        }),
      });

      const json = await response.json();

      if (json.status) {
        showAlert("success", "Thank you for your feedback! ❤️");

        // reset form
        setName("");
        setDesignation("");
        setMessage("");

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        showAlert("error", json.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showAlert("error", "Something went wrong. Try again!");
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#2d365b] via-[#1e2a4a] to-[#2d365b] text-white overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#7883ae]/10"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 py-12 pb-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* LEFT SIDE — Company Info & Links (spans 3 columns) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {/* Logo & Description */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="md:col-span-1"
              >
                <Link to="/" className="inline-block mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl p-2 shadow-lg inline-block"
                  >
                    <img
                      src={ComapanyLogo}
                      alt="Empathy Foundation"
                      className="h-16 rounded-xl"
                    />
                  </motion.div>
                </Link>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-300 text-sm leading-relaxed mb-6"
                >
                  Healing hearts, breaking silence, and building hope — one life
                  at a time through compassion and professional mental health
                  support.
                </motion.p>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4"
                >
                  <motion.a
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    href="#"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full bg-[#1B4F8A] flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    <FaFacebookF className="text-white text-base" />
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    href="#"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-[#f47058] flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    <FaInstagram className="text-white text-base" />
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    href="#"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full bg-[#0EA5E9] flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    <FaLinkedinIn className="text-white text-base" />
                  </motion.a>
                </motion.div>
              </motion.div>

              {/* CONTACT INFO (moved to middle slot) - slightly increased width */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="md:col-span-[1.3] ml-2"
              >
                <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-[#f47058]/30">
                  Contact Info
                </h3>
                <div className="space-y-4 text-sm text-gray-300">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 bg-[#f47058] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaPhoneAlt className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-[#f47058] transition-colors">
                        Phone
                      </p>
                      <p>+91 98765 43210</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 bg-[#7883ae] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaEnvelope className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-[#f47058]  transition-colors">
                        Email
                      </p>
                      <p>support@empathyfoundation.org</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-[#f47058]  transition-colors">
                        Address
                      </p>
                      <p>
                        Sunshine Counselling and Therapy Center,
                        <br />
                        Solitaire building, First & Second floor, Keshavrao More Marg, Collage Road, Nashik-422005.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* QUICK LINKS (moved to right slot) - slightly reduced width */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
                className="md:col-span-[0.7] ml-4 "
              >
                <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-[#f47058]/30">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: "Home", path: "/" },
                    { name: "About Us", path: "/about" },
                    { name: "Initiatives", path: "/initiatives" },
                    { name: "Events", path: "/events" },
                    { name: "Gallery", path: "/gallery" },
                    { name: "Blog", path: "/blog" },
                  ].map((link, index) => (
                    <motion.li key={index} whileHover={{ x: 5 }}>
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-[#f47058] text-sm transition-all duration-300 flex items-center gap-2 group"
                      >
                        <div className="w-1.5 h-1.5 bg-[#f47058] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE — Testimonial Form (spans 1 column) */}
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="w-full"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/20 max-w-2xl xl:max-w-3xl w-full">
                <h3 className="text-xl font-bold text-[#f47058] mb-3 text-center">
                  Share Your Testimony ❤️
                </h3>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-2 justify-center items-center text-center py-4"
                  >
                    <FaCheckCircle className="text-4xl text-[#7883ae]" />
                    <p className="text-white font-medium">
                      Thank you for sharing your inspiration 🤝
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                    <input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-400 outline-none focus:border-[#f47058] transition-all duration-300"
                    />

                    <input
                      placeholder="Designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-400 outline-none focus:border-[#f47058] transition-all duration-300"
                    />

                    <textarea
                      rows="3"
                      placeholder="Your Message (Max 200 characters)..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength="200"
                      className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-400 outline-none resize-none focus:border-[#f47058] transition-all duration-300"
                    />

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#f47058] to-[#e05a44] py-2.5 rounded-lg shadow-lg text-white font-semibold hover:shadow-xl transition-all duration-300"
                    >
                      Submit
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar - Reduced margin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="pt-6 border-t border-white/20 text-center"
        >
          <div className="flex flex-col md:flex-row justify-center items-center text-center gap-3">
            <div className="text-gray-300 text-sm text-center">
              © {currentYear} Empathy Foundation — All Rights Reserved by Manasvi Tech Solutions
            </div>
          </div>
        </motion.div>
      </div>

      {alert.show && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}
    </footer>
  );
}
