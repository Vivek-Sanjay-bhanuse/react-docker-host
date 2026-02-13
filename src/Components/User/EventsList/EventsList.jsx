// EventsList.jsx — FULLY SMOOTH & EASED
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaEye } from "react-icons/fa";
import base_url from "../../../Config";
// const allEvents = [
//   {
//     id: 1,
//     title: "Mental Health Awareness Walk 2025",
//     date: "December 14, 2025",
//     location: "Marine Drive, Mumbai",
//     description:
//       "Join thousands as we walk together to break the silence around mental health and spread hope.",
//     image: "/assets/images/events/walk.jpg",
//   },
//   {
//     id: 2,
//     title: "Free Counselling Camp for Women",
//     date: "November 28, 2025",
//     location: "Sunshine Mindcare Centre, Andheri",
//     description:
//       "A safe space offering free one-on-one counselling sessions for women facing emotional challenges.",
//     image: "/assets/images/events/counselling.jpg",
//   },
//   {
//     id: 3,
//     title: "Youth Mental Wellness Workshop",
//     date: "December 7, 2025",
//     location: "St. Xavier's College, Mumbai",
//     description:
//       "Interactive session with psychologists on stress management and emotional resilience.",
//     image:
//       "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1080&auto=format&fit=crop",
//   },

//   // Past Events
//   {
//     id: 4,
//     title: "World Mental Health Day Vigil",
//     date: "October 10, 2025",
//     location: "Bandra Fort Amphitheatre",
//     description:
//       "Candlelight vigil and stories of hope from survivors.",
//     image: "/assets/images/events/wmhd.jpg",
//   },
//   {
//     id: 5,
//     title: "Community Healing Retreat",
//     date: "September 20, 2025",
//     location: "Lonavala",
//     description:
//       "A weekend of healing circles, meditation, and emotional renewal.",
//     image: "/assets/images/events/retreat.jpg",
//   },
// ];

export default function EventsList() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);

  const today = new Date();

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${base_url}api/events/get`);
      const json = await response.json();

      if (json.status) {
        // Fix API missing description
        const updated = json.data.map((ev) => ({
          ...ev,
          image: `${base_url}public/${ev.image}`, // Full image path
          description: ev.description || "No description available yet.",
        }));

        setAllEvents(updated);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter logic
  const upcoming = allEvents.filter((e) => new Date(e.date) >= today);
  const past = allEvents.filter((e) => new Date(e.date) < today);

  // FIX 1 — Active tab defined before using it
  const [activeTab, setActiveTab] = useState("All");
  const events =
    activeTab === "All"
      ? allEvents
      : activeTab === "Upcoming"
      ? upcoming
      : past;

  return (
    <section className="relative py-14 pt-0 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
      <section className="py-12 pb-4 bg-gradient-to-b from-[#1E3A8A]/10 to-transparent">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-1.5 shadow-xl border border-white/60 shadow-blue-100/30">
              <div className="flex gap-1">
                {["All", "Upcoming", "Past"].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 ease-out overflow-hidden min-w-[100px] ${
                      activeTab === tab
                        ? "text-white"
                        : "text-gray-600 hover:text-[#1E3A8A] hover:bg-gray-50/80"
                    }`}
                  >
                    {/* Active Tab Background with Smooth Transition */}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-[#f47058] rounded-xl shadow-inner"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}

                    {/* Subtle Shine Effect on Active Tab */}
                    {activeTab === tab && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      {tab}
                      <span className="text-sm opacity-70">
                        {tab === "All" && "•"}
                        {tab === "Upcoming" && "↑"}
                        {tab === "Past" && "↓"}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Decorative Circles */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 rounded-full bg-[#f47058]/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[#2d365b]/10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="container mx-auto px-6">
        {events.length === 0 ? (
          <div className="text-center py-28 pb-4">
            <h2 className="text-3xl font-bold text-[#2d365b]">
              No {activeTab} Events Available
            </h2>
            <p className="mt-4 text-lg text-[#475569]">
              Stay tuned for updates!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto mt-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.9,
                  ease: [0.25, 0.1, 0.25, 1], // SMOOTH ease
                }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                }}
                viewport={{ once: false }}
                className="group relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden min-h-[480px] flex flex-col"
              >
                {/* Spotlight */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-56 bg-gradient-to-b
                      from-white/60 via-white/20 to-transparent blur-2xl opacity-0 
                      group-hover:opacity-100 transition-all duration-700"
                  transition={{ ease: "easeInOut" }}
                />

                {/* Event Image */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    whileHover={{
                      scale: 1.12,
                      transition: { duration: 0.8, ease: "easeOut" },
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* View Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full
                               flex items-center justify-center shadow-lg cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <FaEye className="text-[#2d365b] text-lg" />
                  </motion.div>
                </div>

                {/* Title + Details */}
                <div className="px-8 py-5  relative  flex-grow min-h-[180px]">
                  {/* 🌊 Wave Background */}
                  <motion.div
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.25 }}
                    viewport={{ once: true }}
                    style={{ color: "#0EA5E9" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 160"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,80 Q100,50 200,80 T400,80 L400,200 L0,200 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-[#2d365b] mb-4 group-hover:text-[#f47058] transition-colors duration-500 ease-in-out">
                      {event.title}
                    </h3>

                    <div className="space-y-3">
                      <p className="flex items-center gap-3 text-[#475569] text-lg">
                        <FaCalendarAlt className="text-[#f47058]" />
                        {event.date}
                      </p>
                      <p className="flex items-center gap-3 text-[#475569] text-lg">
                        <FaMapMarkerAlt className="text-[#f47058]" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="h-2 bg-gradient-to-r from-[#f47058] to-[#2d365b]"
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
              }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-11 h-11 bg-white/90 rounded-full shadow-xl
                           flex items-center justify-center transition duration-300 hover:scale-110"
              >
                <FaTimes className="text-[#2d365b] text-lg" />
              </button>

              <div className="relative h-72 sm:h-80 md:h-96">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="px-6 py-5">
                <h2 className="text-3xl font-extrabold text-[#2d365b] mb-4">
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-[#475569] text-lg mb-3">
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#f47058]" />
                    {selectedEvent.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#f47058]" />
                    {selectedEvent.location}
                  </p>
                </div>

                <p className="text-[#475569] text-lg leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
