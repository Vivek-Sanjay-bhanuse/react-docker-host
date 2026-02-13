// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaEye } from "react-icons/fa";
import base_url from "../../../Config"; // Adjust the import path as needed

export default function UpcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${base_url}api/events/get`);
        const result = await response.json();

        if (result.status && result.data) {
          // Filter events to show only today and future dates
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison

          const filteredEvents = result.data.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          });

          // Sort events by date (ascending)
          filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setUpcomingEvents(filteredEvents);
        } else {
          setError("Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Error loading events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Show only first 3 events
  const displayedEvents = upcomingEvents.slice(0, 3);
  const hasMoreEvents = upcomingEvents.length > 3;

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  // Format date from API to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="relative py-14 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="animate-pulse text-4xl md:text-5xl font-extrabold text-[#2d365b]">
              Loading Events...
            </div>
          </div>
        </div>
      </section>
    );
  }



  return (
    <>
      <section className="relative py-24 bg-gradient-to-br from-white via-[#eef2f7] to-white overflow-hidden">
        
        {/* Floating Decorative Background Circles */}
        <motion.div
          className="absolute top-16 left-8 w-24 h-24 rounded-full bg-[#f47058]/10"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-12 right-12 w-28 h-28 rounded-full bg-[#2d365b]/10"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-[#f47058]/5"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="container mx-auto px-6 relative z-10">

          {/* Section Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-fit text-4xl md:text-5xl font-extrabold text-[#2d365b] text-center"
          >
            Upcoming Events

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
            Join us in creating hope and healing. Every event is a step toward a more compassionate world.
          </motion.p>

          {/* Events Grid */}
          {upcomingEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-2xl font-bold text-[#2d365b]">
                No Upcoming Events
              </div>
              <p className="mt-4 text-[#475569] text-lg">
                Check back later for new events!
              </p>
            </motion.div>
          ) : (
            <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-16"
            >
              
              {displayedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
                >
                  
                  {/* Torch Light Spotlight */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-60
                                  bg-gradient-to-b from-white/60 via-white/20 to-transparent
                                  blur-2xl opacity-0 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

                  {/* Event Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                       src={`${base_url}public/${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* View Icon Overlay */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm 
                                 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      onClick={() => openModal(event)}
                    >
                      <FaEye className="text-[#2d365b] text-lg" />
                    </motion.div>
                  </div>

                  <div className="px-8 py-3">

                    {/* Event Title */}
                    <h3 className="text-2xl font-bold text-[#2d365b] group-hover:text-[#f47058] transition-colors mb-4">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[#475569]">
                        <FaCalendarAlt className="text-[#f47058] flex-shrink-0" />
                        <span className="text-lg">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[#475569]">
                        <FaMapMarkerAlt className="text-[#f47058] flex-shrink-0" />
                        <span className="text-lg">{event.location}</span>
                      </div>
                    </div>

                    {/* View Details Trigger - Hidden but accessible */}
                  </div>

                  {/* Bottom Gradient Accent */}
                  <div className="h-2 bg-gradient-to-r from-[#f47058] to-[#2d365b]" />
                </motion.div>
              ))}
            </div>
          )}

          {/* View All Events Button */}
          {hasMoreEvents && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <Link
                to="/events"
                className="inline-flex items-center gap-3 bg-[#2d365b] hover:bg-[#1e2647]
                           text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg
                           transition-all duration-300 hover:scale-105"
              >
                View All Events
                <FaEye className="text-white" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-20 px-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/95 hover:bg-white rounded-full 
                           flex items-center justify-center shadow-lg hover:shadow-xl 
                           transition-all duration-300"
              >
                <FaTimes className="text-[#2d365b] text-lg" />
              </button>

              {/* Modal image */}
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                <img
                  src={`${base_url}public/${selectedEvent.image}`}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              {/* Modal content */}
              <div className="px-6 py-4  bg-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2d365b] mb-4">
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-sm sm:text-base text-[#475569] mb-2">
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#0EA5E9]" />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#f47058]" />
                    <span>{selectedEvent.location}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}