// Navbar.jsx
// eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FaBars, FaTimes, FaHeart } from "react-icons/fa";
// import ComapanyLogo from "../../../assets/images/logo/EmpathyFoundationLogo.jpeg";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Initiatives", path: "/initiatives" },
//     { name: "Events", path: "/events" },
//     { name: "Gallery", path: "/gallery" },
//     { name: "Blog", path: "/blog" },
//     { name: "Donate", path: "/donate" },
//     { name: "Contact", path: "/contact" },
//   ];

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50">
//       {/* Background Blur Effect */}
//       <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-[#1E3A8A]/10 shadow-lg" />

//       <nav className="relative container mx-auto flex h-20 items-center justify-between px-6">
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <Link to="/" className="flex items-center gap-3">
//             <img
//               src={ComapanyLogo}
//               alt="Empathy Foundation"
//               className="h-14 w-auto rounded-lg shadow-md"
//             />
//           </Link>
//         </motion.div>

//         {/* Desktop Navigation */}
//         <ul className="hidden lg:flex items-center gap-1">
//           {navLinks.map((link, index) => (
//             <motion.li
//               key={link.name}
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.05 }}
//             >
//               <Link
//                 to={link.path}
//                 className={`relative px-5 py-3 text-lg font-medium transition-all duration-300 rounded-full
//                   ${location.pathname === link.path
//                     ? "text-[#FF5733] font-bold"
//                     : "text-[#1E3A8A] hover:text-[#FF5733]"
//                   }`}
//               >
//                 {link.name}
//                 {/* Active Indicator */}
//                 {location.pathname === link.path && (
//                   <motion.div
//                     layoutId="navbar-indicator"
//                     className="absolute inset-0 bg-[#FF5733]/10 rounded-full -z-10"
//                     transition={{ type: "spring", stiffness: 380, damping: 30 }}
//                   />
//                 )}
//               </Link>
//             </motion.li>
//           ))}
//         </ul>

//         {/* Donate Button - Always Visible */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Link
//             to="/donate"
//             className="bg-gradient-to-r from-[#FF5733] to-[#e04e2d] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
//           >
//             Donate <FaHeart className="text-white animate-pulse" />
//           </Link>
//         </motion.div>

//         {/* Mobile Menu Toggle */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsOpen(!isOpen)}
//           className="lg:hidden text-[#1E3A8A] text-3xl p-2"
//           aria-label="Toggle menu"
//         >
//           {isOpen ? <FaTimes /> : <FaBars />}
//         </motion.button>
//       </nav>

//       {/* Mobile Menu - Full Screen Overlay */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-[#1E3A8A]/95 backdrop-blur-2xl z-40 lg:hidden"
//           >
//             <motion.div
//               initial={{ x: "100%" }}
//               Liquidity={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="flex flex-col items-center justify-center h-full text-white"
//             >
//               {navLinks.map((link, index) => (
//                 <motion.div
//                   key={link.name}
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link
//                     to={link.path}
//                     onClick={() => setIsOpen(false)}
//                     className="block py-5 text-3xl font-bold hover:text-[#FF5733] transition duration-300"
//                   >
//                     {link.name}
//                   </Link>
//                 </motion.div>
//               ))}

//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="mt-12"
//               >
//                 <Link
//                   to="/donate"
//                   onClick={() => setIsOpen(false)}
//                   className="inline-flex items-center gap-4 bg-white text-[#1E3A8A] px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:bg-[#FF5733] hover:text-white transition-all duration-300"
//                 >
//                   Donate Now <FaHeart className="text-3xl animate-pulse" />
//                 </Link>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaHeart, FaHandsHelping, FaCalendarCheck  } from "react-icons/fa";
import ComapanyLogo from "../../../assets/images/logo/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Initiatives", path: "/initiatives" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[60]">
      {/* Background */}
      <motion.div
        className={`absolute inset-0 backdrop-blur-xl transition-all duration-400 ${isScrolled ? "bg-white/97 shadow-xl" : "bg-white/95 shadow-md"
          }`}
        initial={false}
        animate={{ height: isScrolled ? "65px" : "70px" }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7883ae]/60 to-transparent" />
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#f47058] to-transparent"
          animate={{ opacity: [0.6, 0.9, 0.6], width: ["50px", "70px", "50px"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <nav className="relative max-w-8xl flex h-14 sm:h-16 lg:h-[70px] items-center justify-between px-4 sm:px-6 lg:px-4 lg:ml-8  ">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        >
          <Link to="/" className="flex items-center gap-3 sm:gap-3 lg:mr-10">
            <motion.img
              src={ComapanyLogo}
              alt="Empathy Foundation"
              className="h-9 sm:h-10 lg:h-11 w-auto"
              whileHover={{
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.4 },
              }}
            />
          </Link>
        </motion.div>

        {/* Desktop links */}
        <motion.ul
          className="hidden lg:flex items-center gap-0 xl:gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link) => (
            <motion.li
              key={link.name}
              variants={itemVariants}
              onHoverStart={() => setActiveHover(link.path)}
              onHoverEnd={() => setActiveHover(null)}
            >
              <Link
                to={link.path}
                className={`relative px-4 py-2 font-medium rounded-lg transition-all duration-300 group ${location.pathname === link.path
                    ? "text-[#f47058] font-semibold"
                    : "text-[#2d365b] hover:text-[#f47058]"
                  }`}
              >
                <span className="relative z-10">{link.name}</span>

                <motion.span
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#f47058]/5 to-[#7883ae]/5 opacity-0 -z-10"
                  animate={{ opacity: activeHover === link.path ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />

                {location.pathname === link.path && (
                  <motion.span
                    layoutId="desktopIndicator"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-[#f47058] rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}

                {activeHover === link.path && location.pathname !== link.path && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#7883ae] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* DESKTOP BUTTONS (Volunteer + Donate + Book Appointment) */}
        <motion.div
          className="hidden lg:flex items-center gap-2 lg:gap-4 lg:ml-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Volunteer */}
          <motion.div
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/donate?tab=volunteer"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-full text-[#2d365b] font-medium border border-[#7883ae] shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 hover:bg-[#7883ae] hover:text-white hover:border-[#7883ae] text-sm"
            >
              <FaHandsHelping className="text-sm" />
              Volunteer
            </Link>

          </motion.div>

          {/* Donate */}
          <motion.div
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/donate"
              className="px-5 py-2.5 rounded-full text-white font-semibold bg-[#f47058] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:bg-[#e05a44] text-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <FaHeart className="text-xs" />
              </motion.div>
              Donate
            </Link>
          </motion.div>

          {/* Book Appointment – same style as Volunteer */}
          <motion.div
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/appointment"   // or your appointment route
              className="px-4 py-2 rounded-full text-[#2d365b] font-medium border border-[#7883ae] shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 hover:bg-[#7883ae] hover:text-white hover:border-[#7883ae] text-sm"
            >
              <FaCalendarCheck  className="text-xs" />
              Book Appointment
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="lg:hidden text-[#2d365b] text-xl sm:text-2xl p-2 bg-white/60 rounded-lg  border border-gray-200"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <FaBars />
        </motion.button>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 bg-black/40  z-[55]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-[60] flex flex-col p-4 sm:p-5 overflow-y-auto border-l border-gray-100"
            >
              {/* Close */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 bg-[#2d365b] text-white p-2 rounded-xl shadow-lg hover:bg-[#f47058] transition-all duration-300 w-9 h-9 flex items-center justify-center hover:shadow-xl hover:scale-110 active:scale-95"
                whileHover={{ rotate: 90 }}
              >
                <FaTimes size={14} />
              </motion.button>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mt-12 mb-4 text-center"
              >
                <motion.img
                  src={ComapanyLogo}
                  alt="Empathy Foundation"
                  className="h-12 w-auto mx-auto mb-2"
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>

              {/* Links */}
              <div className="flex-1 space-y-0 mt-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial="hidden"
                    animate="visible"
                    variants={mobileItemVariants}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="relative"
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block text-base sm:text-lg font-medium py-3 px-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${location.pathname === link.path
                          ? "text-[#f47058] bg-[#f47058]/5 font-semibold"
                          : "text-[#2d365b] hover:text-[#f47058] hover:bg-gray-50/80"
                        }`}
                    >
                      <motion.span
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center relative z-10"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* MOBILE BUTTONS (visible on mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                className="mt-6 mb-4 space-y-2 p-2"
              >
                {/* Volunteer */}
                <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/donate"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-white text-[#2d365b] py-2.5 rounded-xl text-base font-semibold flex justify-center items-center gap-2 shadow-sm border border-[#7883ae] hover:bg-[#7883ae] hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <FaHandsHelping className="text-sm" />
                    Volunteer
                  </Link>
                </motion.div>

                {/* Donate */}
                <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/donate"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gradient-to-r from-[#f47058] to-[#e05a44] text-white py-2.5 rounded-xl text-base font-semibold flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                  >
                    <FaHeart className="text-sm" />
                    Donate Now
                  </Link>
                </motion.div>

                {/* Book Appointment */}
                <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/appointment"  // same route as desktop
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-white text-[#2d365b] py-2.5 rounded-xl text-base font-semibold flex justify-center items-center gap-2 shadow-sm border border-[#7883ae] hover:bg-[#7883ae] hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <FaCalendarCheck  className="text-sm" />
                    Book Appointment
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

