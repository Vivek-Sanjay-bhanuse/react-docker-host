import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  faHeart,
  faBrain,
  faHandsHelping,
  faPeace,
  faSmile,
  faSpa,
  faCloud,
  faStar,
  faLeaf,
  faRupeeSign,
  faCalendarAlt,
  faUserFriends,
  faHandHoldingHeart,
  faClock,
  faBriefcase,
  faUpload,
  faQrcode,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import DonationForm from "../../Components/User/DonationForm/DonationForm";
import VolunteerForm from "../../Components/User/DonationForm/VolunteerForm";

const DonationVolunteerSection = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    if (tab === "volunteer") {
      setActiveTab("volunteer");
      setCurrentStep(1);
    } else if (tab === "donate") {
      setActiveTab("donate");
      setCurrentStep(1);
    }
  }, [location.search]);

  // Background words for both forms
  const backgroundWords = [
    { text: "Support", icon: faHeart },
    { text: "Care", icon: faHandsHelping },
    { text: "Hope", icon: faStar },
    { text: "Help", icon: faHandHoldingHeart },
    { text: "Joy", icon: faSmile },
    { text: "Peace", icon: faPeace },
    { text: "Growth", icon: faLeaf },
    { text: "Calm", icon: faCloud },
    { text: "Balance", icon: faBrain },
    { text: "Focus", icon: faSpa },
    { text: "Strength", icon: faHandsHelping },
    { text: "Harmony", icon: faPeace },
    { text: "Compassion", icon: faHeart },
    { text: "Service", icon: faHandsHelping },
    { text: "Kindness", icon: faHeart },
    { text: "Unity", icon: faUserFriends },
  ];

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        padding: "60px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Icons */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes floatGently {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}</style>

        {backgroundWords.map((item, index) => {
          const positions = [
            { top: "5%", left: "10%" },
            { top: "15%", right: "8%" },
            { top: "30%", left: "5%" },
            { top: "45%", right: "8%" },
            { top: "60%", left: "10%" },
            { top: "75%", right: "10%" },
            { bottom: "10%", left: "7%" },
            { bottom: "18%", right: "20%" },
            { top: "22%", left: "22%" },
            { top: "38%", right: "45%" },
            { bottom: "30%", left: "40%" },
            { bottom: "22%", right: "40%" },
            { top: "6%", right: "25%" },
            { top: "70%", left: "45%" },
            { bottom: "8%", right: "50%" },
            { bottom: "50%", left: "50%" },
          ];

          const pos = positions[index] || { top: "50%", left: "50%" };

          return (
            <div
              key={item.text + index}
              style={{
                position: "absolute",
                ...pos,
                transform: "translate(-50%, -50%)",
                fontSize: "2.2rem",
                opacity: 0.3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#2a5298",
                animation: "floatGently 6s ease-in-out infinite",
              }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                style={{ fontSize: "1em", marginBottom: "4px" }}
              />
              <span
                style={{
                  fontSize: "0.55em",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  opacity: 0.9,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className="container mx-auto px-4"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Tab Section */}
        <div className="flex justify-center mb-16">
          <div
            style={{
              background: "white",
              backdropFilter: "blur(10px)",
              borderRadius: "50px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              padding: "8px",
              display: "inline-flex",
              border: "2px solid rgba(42, 82, 152, 0.1)",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("donate");
                setCurrentStep(1);
              }}
              style={{
                padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 50px)",
                borderRadius: "40px",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 600,
                transition: "all 0.3s ease",
                border: "none",
                background:
                  activeTab === "donate"
                    ? "linear-gradient(45deg, #ff6b35, #ff8e53)"
                    : "transparent",
                color: activeTab === "donate" ? "white" : "#6c757d",
                cursor: "pointer",
                margin: "0 4px",
              }}
            >
              <FontAwesomeIcon
                icon={faHandHoldingHeart}
                style={{ marginRight: "8px" }}
              />
              Donate
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("volunteer");
                setCurrentStep(1);
              }}
              style={{
                padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 50px)",
                borderRadius: "40px",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 600,
                transition: "all 0.3s ease",
                border: "none",
                background:
                  activeTab === "volunteer"
                    ? "linear-gradient(45deg, #2a5298, #1e40af)"
                    : "transparent",
                color: activeTab === "volunteer" ? "white" : "#6c757d",
                cursor: "pointer",
                margin: "0 4px",
              }}
            >
              <FontAwesomeIcon
                icon={faHandsHelping}
                style={{ marginRight: "8px" }}
              />
              Volunteer
            </motion.button>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex justify-center">
          <div className="w-full lg:w-4/5 xl:w-2/3">
            {activeTab === "donate" ? (
              <DonationForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            ) : (
              <VolunteerForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationVolunteerSection;
