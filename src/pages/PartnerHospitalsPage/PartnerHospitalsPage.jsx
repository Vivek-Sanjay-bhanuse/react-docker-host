// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/User/Navbar/Navbar";
import Footer from "../../Components/User/Footer/Footer";
import { FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PartnerHospitalsPage() {
  
  const [activeHospital, setActiveHospital] = useState("Sunshine");
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_EVENTS = "http://localhost:5000/api/events";
  const API_GALLERY = "http://localhost:5000/api/gallery";

  const hospitals = {
    Sunshine: {
      name: "Sunshine Mindcare Center",
      description:
        "A center committed to compassionate mental health support, psychiatric services, and rehabilitation therapies.",
      services: [
        "Psychiatric Consultation",
        "Counselling & Therapy",
        "IPD & OPD Mental Health Support",
        "Crisis Intervention",
        "Addiction Recovery Support"
      ],
      phone: "+91 90000 11111",
      address: "Sunshine Campus, Mumbai India",
      image: "/assets/images/partners/sunshine.jpg"
    },

    Manoday: {
      name: "Manoday Mental Wellness Hospital",
      description:
        "Dedicated to accessible mental health services, awareness programs and emotional well-being support.",
      services: [
        "Psychological Assessment",
        "Child & Adolescent Support",
        "Group Therapy",
        "Wellness Workshops",
        "Rehabilitation Services"
      ],
      phone: "+91 80000 22222",
      address: "Manoday Campus, Mumbai India",
      image: "/assets/images/partners/manoday.jpg"
    }
  };

  useEffect(() => {
  const loadData = async () => {
    
    setLoading(true);

    const [eventsRes, galleryRes] = await Promise.all([
      axios.get("/api/events"),
      axios.get("/api/gallery")
    ]);

    setEvents(eventsRes.data.filter(e => e.hospital === activeHospital));
    setGallery(galleryRes.data.filter(g => g.hospital === activeHospital));
    
    setLoading(false);
  };    

  loadData();
}, [activeHospital]);


  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <header className="w-full bg-primary text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Partner Hospitals</h1>
        <p className="mt-2 text-accent">Collaborating for better mental health outcomes</p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mt-10">
        {["Sunshine", "Manoday"].map((name) => (
          <button
            key={name}
            onClick={() => setActiveHospital(name)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeHospital === name ? "bg-secondary text-white" : "bg-accent/40 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Hospital Details */}
      <section className="container mx-auto px-6 mt-14">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          <img
            src={hospitals[activeHospital].image}
            alt={activeHospital}
            className="rounded-xl shadow-lg w-full object-cover"
          />

          {/* Text Content */}
          <div>
            <h2 className="text-primary text-3xl font-bold">{hospitals[activeHospital].name}</h2>
            <p className="text-textgray mt-4">{hospitals[activeHospital].description}</p>

            {/* Contact */}
            <div className="mt-5 text-sm flex flex-col gap-2">
              <p className="flex items-center gap-2 text-secondary font-semibold">
                <FaPhoneAlt /> {hospitals[activeHospital].phone}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt /> {hospitals[activeHospital].address}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-6 mt-14">
        <h3 className="text-primary text-2xl font-semibold mb-4 text-center">Services Offered</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hospitals[activeHospital].services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-primary/20 p-4 rounded-lg shadow-sm flex items-center gap-3"
            >
              <FaCheckCircle className="text-secondary text-xl" />
              <span className="font-medium text-gray-700">{service}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Events under Hospital */}
      <section className="container mx-auto px-6 mt-16">
        <h3 className="text-primary text-2xl font-semibold mb-6 text-center">
          {activeHospital} — Events & Activities
        </h3>

        {loading && <p className="text-center text-gray-600">Loading events...</p>}

        {!loading && events.length === 0 && (
          <p className="text-center text-gray-500">No events available for this hospital.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <motion.div
              key={event._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white border p-5 rounded-lg shadow-md"
            >
              <h4 className="text-primary font-bold text-lg">{event.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{event.date}</p>

              <Link
                to={`/events/${event._id}`}
                className="mt-4 block text-secondary font-semibold hover:text-primary transition"
              >
                View Details →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="container mx-auto px-6 mt-16 mb-20">
        <h3 className="text-primary text-2xl font-semibold mb-6 text-center">
          {activeHospital} Gallery
        </h3>

        {gallery.length === 0 ? (
          <p className="text-center text-gray-500">No media available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.slice(0, 6).map((item, i) => (
              <img
                key={i}
                src={item.url}
                alt="gallery"
                className="rounded-xl h-32 w-full object-cover shadow"
              />
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/gallery"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition flex items-center gap-2 mx-auto"
          >
            View Full Gallery <FaArrowRight />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
