// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import  Event from "../../../assets/images/Homepage/Event.jpg";


export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://localhost:5000/api/events/${id}`; // Replace when backend ready

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_URL]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse bg-accent h-48 w-3/4 mx-auto rounded-xl"></div>
        <p className="mt-6 text-gray-500">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center text-gray-600">
        <p>Event not found.</p>
        <Link 
          to="/events" 
          className="mt-4 inline-block text-primary font-semibold hover:text-secondary"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <section className="py-20 bg-accent/20">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Back Link */}
        <Link 
          to="/events"
          className="flex items-center gap-2 text-primary hover:text-secondary transition mb-6 font-semibold"
        >
          <FaArrowLeft /> Back to Events
        </Link>

        {/* Banner Image */}
        {event.image && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={event.image}
            alt={event.title}
            className="w-full h-60 object-cover rounded-xl shadow-lg"
          />
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-primary font-bold text-3xl md:text-4xl mt-8"
        >
          {event.title}
        </motion.h1>

        {/* Sub Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex flex-wrap gap-6 text-gray-700 text-sm"
        >
          <p className="flex items-center gap-2"><FaCalendarAlt className="text-secondary" /> {event.date}</p>
          <p className="flex items-center gap-2"><FaClock className="text-secondary" /> {event.time || "TBA"}</p>
          <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-secondary" /> {event.location}</p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-gray-600 leading-relaxed"
        >
          {event.description}
        </motion.p>

        {/* Optional Extra Content */}
        {event.additionalDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 bg-white p-6 rounded-xl shadow-md border border-accent"
          >
            <h3 className="text-primary font-semibold text-lg">More Information</h3>
            <p className="mt-2 text-gray-600">{event.additionalDetails}</p>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          {event.registerLink && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={event.registerLink}
              target="_blank"
              className="bg-secondary text-white px-6 py-3 rounded-lg shadow hover:bg-primary transition font-semibold"
            >
              Register Now
            </motion.a>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-primary text-primary px-6 py-3 rounded-lg shadow hover:bg-primary hover:text-white transition font-semibold"
          >
            Share Event
          </motion.button>
        </div>
      </div>
    </section>
  );
}
