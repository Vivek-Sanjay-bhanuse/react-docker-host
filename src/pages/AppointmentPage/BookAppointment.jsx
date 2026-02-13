import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../Components/CustomAlert/CustomAlert";
import base_url from "../../Config";

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    appointmentDate: "",
    timeSlot: "",
    appointment_time: "",
    alternate_contact_no: "",
    concerns: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    appointmentDate: "",
    timeSlot: "",
    alternate_contact_no: "",
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "info", message: "" });
  const navigate = useNavigate();

  // Time zones in 2-hour blocks from 10 AM to 8 PM
  const timeZones = [
    { id: 1, label: "10:00 AM - 12:00 PM", start: "10:00", end: "12:00" },
    { id: 2, label: "12:00 PM - 02:00 PM", start: "12:00", end: "14:00" },
    { id: 3, label: "02:00 PM - 04:00 PM", start: "14:00", end: "16:00" },
    { id: 4, label: "04:00 PM - 06:00 PM", start: "16:00", end: "18:00" },
    { id: 5, label: "06:00 PM - 08:00 PM", start: "18:00", end: "20:00" },
  ];

  // Enhanced background words with more coverage
  const backgroundWords = [
    { text: "Healing", icon: faHeart }, // empathy, emotional healing
    { text: "Mindfulness", icon: faSpa }, // awareness, focus
    { text: "Support", icon: faHandsHelping }, // help, guidance
    { text: "Joy", icon: faSmile }, // happiness, positivity
    { text: "Wellness", icon: faLeaf }, // overall well-being 🌿 (better than smile)
    { text: "Therapy", icon: faHeart }, // therapeutic care
    { text: "Calm", icon: faCloud }, // peaceful, soft
    { text: "Growth", icon: faStar }, // personal improvement
    { text: "Balance", icon: faPeace }, // equilibrium, centered life
    { text: "Clarity", icon: faBrain }, // mental clarity
    { text: "Strength", icon: faHandsHelping }, // support + courage
    { text: "Harmony", icon: faPeace }, // peace & harmony
    { text: "Hope", icon: faStar }, // aspiration, positivity
    { text: "Care", icon: faHeart }, // compassion, care
    { text: "Focus", icon: faBrain }, // concentration
  ];

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validationRules = {
    firstName: {
      required: true,
      pattern: /^[A-Za-z\s]{2,50}$/,
      message: "First name must be 2-50 letters only",
    },
    lastName: {
      required: true,
      pattern: /^[A-Za-z\s]{2,50}$/,
      message: "Last name must be 2-50 letters only",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    phone: {
      required: true,
      pattern: /^(?:\+?91|0)?[6789]\d{9}$/,
      message: "Please enter a valid 10-digit Indian mobile number",
    },
    alternate_contact_no: {
      required: false,
      pattern: /^(?:\+?91|0)?[6789]\d{9}$|^$/,
      message:
        "Please enter a valid 10-digit Indian mobile number or leave empty",
    },
    age: {
      required: true,
      pattern: /^(?:[1-9][0-9]?|100)$/,
      message: "Please enter age between 1 and 100",
    },
    gender: {
      required: true,
      message: "Please select your gender",
    },
    appointmentDate: {
      required: true,
      message: "Please select an appointment date",
    },
    timeSlot: {
      required: true,
      message: "Please select a time slot",
    },
  };

  // Custom validation for alternate contact number
  const validateAlternateContact = (value) => {
    if (!value) return "";
    if (value === formData.phone) {
      return "Alternate number must be different from primary number";
    }
    const rules = validationRules.alternate_contact_no;
    if (!rules.pattern.test(value)) {
      return rules.message;
    }
    return "";
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    let error = "";

    if (name === "alternate_contact_no") {
      return validateAlternateContact(value);
    }

    if (rules.required && (!value || value.trim() === "")) {
      error = "This field is required";
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message;
    } else if (rules.custom && !rules.custom(value)) {
      error = rules.message;
    }

    return error;
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 1:
        const step1Fields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "age",
          "gender",
        ];
        step1Fields.forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) {
            errors[field] = error;
            isValid = false;
          }
        });

        // Validate alternate contact
        if (formData.alternate_contact_no) {
          const altPhoneError = validateAlternateContact(
            formData.alternate_contact_no
          );
          if (altPhoneError) {
            errors.alternate_contact_no = altPhoneError;
            isValid = false;
          }
        }
        break;

      case 2:
        const dateError = validateField(
          "appointmentDate",
          formData.appointmentDate
        );
        const timeError = validateField("timeSlot", formData.timeSlot);
        if (dateError) {
          errors.appointmentDate = dateError;
          isValid = false;
        }
        if (timeError) {
          errors.timeSlot = timeError;
          isValid = false;
        }
        break;
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;
    if (name === "firstName" || name === "lastName") {
      cleanedValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name === "phone" || name === "alternate_contact_no") {
      cleanedValue = value.replace(/\D/g, "");
    } else if (name === "age") {
      cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue) {
        const num = parseInt(cleanedValue);
        if (num > 100) cleanedValue = "100";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));

    if (touchedFields[name]) {
      const error = validateField(name, cleanedValue);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setAlertConfig({
        type: "warning",
        message:
          "Please fill in all required fields correctly before proceeding.",
      });
      setShowAlert(true);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      appointmentDate: "",
      timeSlot: "",
      appointment_time: "",
      alternate_contact_no: "",
      concerns: "",
    });
    setFormErrors({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      appointmentDate: "",
      timeSlot: "",
      alternate_contact_no: "",
    });
    setTouchedFields({});
    setCurrentStep(1);
  };

  const handleDateSelect = (date) => {
    // Check if date is within next 10 days
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 10);
    maxDate.setHours(23, 59, 59, 999);

    if (selectedDate < today || selectedDate > maxDate) {
      setFormErrors((prev) => ({
        ...prev,
        appointmentDate: `Date must be between ${formatDateForDisplay(
          today
        )} and ${formatDateForDisplay(maxDate)}`,
      }));
      setFormData((prev) => ({ ...prev, appointmentDate: "", timeSlot: "" }));
    } else {
      setFormData((prev) => ({ ...prev, appointmentDate: date, timeSlot: "" }));
      setFormErrors((prev) => ({ ...prev, appointmentDate: "" }));
    }
  };

  const handleTimeSelect = (timeZone) => {
    const time24 = convertTo24Hour(timeZone.start);
    setFormData((prev) => ({
      ...prev,
      timeSlot: timeZone.label,
      appointment_time: time24,
    }));
    setFormErrors((prev) => ({ ...prev, timeSlot: "" }));
  };

  const convertTo24Hour = (time12h) => {
    let [hours, minutes] = time12h.split(":");
    if (parseInt(hours) < 12 && time12h.includes("PM")) {
      hours = parseInt(hours) + 12;
    }
    return `${hours.padStart(2, "0")}:${minutes}:00`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate min and max dates (today to 10 days from today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);
    return maxDate.toISOString().split("T")[0];
  };

  // Get today's date for display
  const getTodayDisplayDate = () => {
    const today = new Date();
    return formatDateForDisplay(today);
  };

  // Get max date for display
  const getMaxDisplayDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);
    return formatDateForDisplay(maxDate);
  };

  // Check if time zone should be disabled
  const isTimeZoneDisabled = (timeZone) => {
    if (!formData.appointmentDate) return false;

    const today = new Date();
    const selectedDate = new Date(formData.appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    // If selected date is today
    if (selectedDate.toDateString() === today.toDateString()) {
      const currentTime = today.getHours() * 60 + today.getMinutes();
      const zoneStart =
        parseInt(timeZone.start.split(":")[0]) * 60 +
        parseInt(timeZone.start.split(":")[1] || 0);
      const zoneEnd =
        parseInt(timeZone.end.split(":")[0]) * 60 +
        parseInt(timeZone.end.split(":")[1] || 0);

      // If current time is more than 50% into the time zone, disable it
      const zoneDuration = zoneEnd - zoneStart;
      const timeInZone = currentTime - zoneStart;

      if (currentTime >= zoneEnd) {
        return true; // Zone has already passed
      } else if (currentTime >= zoneStart && timeInZone > zoneDuration * 0.5) {
        return true; // More than 50% of zone has passed
      }
    }

    return false;
  };

  const submitAppointmentToAPI = async () => {
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      contact_no: formData.phone,
      alternate_contact_no: formData.alternate_contact_no || null,
      age: formData.age,
      gender: formData.gender,
      concerns: formData.concerns || null,
      appointment_date: formData.appointmentDate,
      appointment_time: formData.appointment_time,
      time_slot: formData.timeSlot,
    };

    const response = await axios.post(
      `${base_url}api/appointment/add`,
      payload
    );
    return response.data;
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      setAlertConfig({
        type: "error",
        message: "Please fix all validation errors before submitting.",
      });
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitAppointmentToAPI();
      if (result?.status === true) {
        setAlertConfig({
          type: "success",
          message: `Your appointment is booked. Our team will connect with you shortly.`,
          onClose: () => {
            resetForm();
            setCurrentStep(1);
            setShowAlert(false);
          },
        });
        setShowAlert(true);
      } else {
        setAlertConfig({
          type: "error",
          message:
            result.message ||
            "Appointment may not have been booked. Please check with support.",
        });
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Appointment booking error:", err);
      setAlertConfig({
        type: "error",
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = () => {
    const fields = ["firstName", "lastName", "email", "phone", "age", "gender"];
    return fields.every((field) => !formErrors[field] && formData[field]);
  };

  const isStep2Valid = () =>
    !formErrors.appointmentDate &&
    !formErrors.timeSlot &&
    formData.appointmentDate &&
    formData.timeSlot;

  return (
    <>
      {showAlert && (
        <CustomAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={alertConfig.onClose}
          onConfirm={alertConfig.onConfirm}
          duration={alertConfig.type === "success" ? 5000 : 3000}
        />
      )}

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          padding: "20px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Enhanced Animated Background */}
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

          {/* PREDEFINED FIXED POSITIONS */}
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

              // extra words (nicely spaced)
              { top: "22%", left: "45%" },
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
          <div className="flex justify-center">
            <div className="w-full lg:w-4/5 xl:w-2/3">
              <div className="text-center mb-10">
                <h1
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    fontWeight: 800,
                    color: "#2a5298",
                    letterSpacing: "0.5px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Book Your Appointment
                </h1>

                <p
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    color: "#6c757d",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                  }}
                >
                  Schedule your session with our experienced mental-health
                  professionals.
                </p>
              </div>

              {/* Enhanced Progress Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                  margin: "0 auto 3rem",
                  padding: "0 20px",
                  maxWidth: "600px",
                }}
              >
                {/* Progress Line - Fixed positioning */}
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "100px",
                    right: "100px",
                    height: "4px",
                    background: "#e9ecef",
                    zIndex: 0,
                    borderRadius: "2px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "linear-gradient(45deg, #ff6b35, #ff8e53)",
                      transition: "width 0.5s ease",
                      borderRadius: "2px",
                      width: `${(currentStep - 1) * 50}%`,
                    }}
                  ></div>
                </div>

                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 1,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background:
                          step === currentStep
                            ? "#2a5298"
                            : step < currentStep
                            ? "#28a745"
                            : "#e9ecef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        color:
                          step === currentStep || step < currentStep
                            ? "white"
                            : "#6c757d",
                        transition: "all 0.3s ease",
                        border: `3px solid ${
                          step === currentStep
                            ? "#2a5298"
                            : step < currentStep
                            ? "#28a745"
                            : "#e9ecef"
                        }`,
                        ...(step === currentStep && {
                          transform: "scale(1.1)",
                          boxShadow: "0 0 0 5px rgba(42, 82, 152, 0.2)",
                        }),
                      }}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                        fontWeight: 600,
                        color: step === currentStep ? "#2a5298" : "#6c757d",
                        transition: "color 0.3s ease",
                        textAlign: "center",
                        padding: "0 5px",
                      }}
                    >
                      {step === 1 && "Basic Details"}
                      {step === 2 && "Date & Time"}
                      {step === 3 && "Summary"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div
                  style={{
                    background: "white",
                    padding: "clamp(1.5rem, 4vw, 2.5rem)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    zIndex: 1,
                    animation: "slideIn 0.5s ease-out",
                  }}
                >
                  <style>{`
                    @keyframes slideIn {
                      from { opacity: 0; transform: translateX(50px); }
                      to { opacity: 1; transform: translateX(0); }
                    }
                    
                    /* Responsive media queries */
                    @media (max-width: 640px) {
                      .form-grid-2 {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                      }
                      
                      .form-container {
                        padding: 1rem !important;
                      }
                    }
                    
                    @media (max-width: 768px) {
                      .form-grid-2 {
                        grid-template-columns: 1fr;
                      }
                    }
                  `}</style>

                  <h2
                    style={{
                      color: "#2a5298",
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    Tell Us About Yourself
                  </h2>
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                      lineHeight: 1.5,
                    }}
                  >
                    We'll match you with the right specialist
                  </p>

                  <form
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(1rem, 3vw, 1.5rem)",
                    }}
                  >
                    <div
                      className="form-grid-2"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "clamp(0.8rem, 2vw, 1rem)",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#2a5298",
                            marginBottom: "0.5rem",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          }}
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{
                            padding:
                              "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                            border: `2px solid ${
                              formErrors.firstName ? "#f44336" : "#e9ecef"
                            }`,
                            borderRadius: "8px",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            transition: "all 0.3s ease",
                            background: "#f8f9fa",
                            width: "100%",
                          }}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              marginTop: "5px",
                            }}
                          >
                            {formErrors.firstName}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#2a5298",
                            marginBottom: "0.5rem",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          }}
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{
                            padding:
                              "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                            border: `2px solid ${
                              formErrors.lastName ? "#f44336" : "#e9ecef"
                            }`,
                            borderRadius: "8px",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            transition: "all 0.3s ease",
                            background: "#f8f9fa",
                            width: "100%",
                          }}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              marginTop: "5px",
                            }}
                          >
                            {formErrors.lastName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="form-grid-2"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "clamp(0.8rem, 2vw, 1rem)",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#2a5298",
                            marginBottom: "0.5rem",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          }}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{
                            padding:
                              "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                            border: `2px solid ${
                              formErrors.email ? "#f44336" : "#e9ecef"
                            }`,
                            borderRadius: "8px",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            transition: "all 0.3s ease",
                            background: "#f8f9fa",
                            width: "100%",
                          }}
                          placeholder="example@email.com"
                        />
                        {formErrors.email && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              marginTop: "5px",
                            }}
                          >
                            {formErrors.email}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#2a5298",
                            marginBottom: "0.5rem",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          }}
                        >
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{
                            padding:
                              "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                            border: `2px solid ${
                              formErrors.phone ? "#f44336" : "#e9ecef"
                            }`,
                            borderRadius: "8px",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            transition: "all 0.3s ease",
                            background: "#f8f9fa",
                            width: "100%",
                          }}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                        />
                        {formErrors.phone && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              marginTop: "5px",
                            }}
                          >
                            {formErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="form-grid-2"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "clamp(0.8rem, 2vw, 1rem)",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#2a5298",
                            marginBottom: "0.5rem",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          }}
                        >
                          Alternate Mobile (Optional)
                        </label>
                        <input
                          type="tel"
                          name="alternate_contact_no"
                          value={formData.alternate_contact_no}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{
                            padding:
                              "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                            border: `2px solid ${
                              formErrors.alternate_contact_no
                                ? "#f44336"
                                : "#e9ecef"
                            }`,
                            borderRadius: "8px",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            transition: "all 0.3s ease",
                            background: "#f8f9fa",
                            width: "100%",
                          }}
                          placeholder="Different from primary number"
                          maxLength="10"
                        />
                        {formErrors.alternate_contact_no && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              marginTop: "5px",
                            }}
                          >
                            {formErrors.alternate_contact_no}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label
                          style={{
                            fontWeight: 600,
                            color: "#2a5298",
                            marginBottom: "0.5rem",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          }}
                        >
                          Age *
                        </label>
                        <input
                          type="text"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          style={{
                            padding:
                              "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                            border: `2px solid ${
                              formErrors.age ? "#f44336" : "#e9ecef"
                            }`,
                            borderRadius: "8px",
                            fontSize: "clamp(0.9rem, 2vw, 1rem)",
                            transition: "all 0.3s ease",
                            background: "#f8f9fa",
                            width: "100%",
                          }}
                          placeholder="Enter your age"
                          inputMode="numeric"
                        />
                        {formErrors.age && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              marginTop: "5px",
                            }}
                          >
                            {formErrors.age}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#2a5298",
                          marginBottom: "0.5rem",
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                        }}
                      >
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        style={{
                          padding:
                            "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                          border: `2px solid ${
                            formErrors.gender ? "#f44336" : "#e9ecef"
                          }`,
                          borderRadius: "8px",
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          transition: "all 0.3s ease",
                          background: "#f8f9fa",
                          width: "100%",
                        }}
                      >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                      {formErrors.gender && (
                        <span
                          style={{
                            color: "#f44336",
                            fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                            marginTop: "5px",
                          }}
                        >
                          {formErrors.gender}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#2a5298",
                          marginBottom: "0.5rem",
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                        }}
                      >
                        Primary Concern (Optional)
                      </label>
                      <textarea
                        name="concerns"
                        value={formData.concerns}
                        onChange={handleInputChange}
                        style={{
                          padding:
                            "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          transition: "all 0.3s ease",
                          background: "#f8f9fa",
                          resize: "vertical",
                          minHeight: "80px",
                          width: "100%",
                        }}
                        rows="3"
                        placeholder="Briefly describe your concerns (optional)"
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "clamp(1.5rem, 3vw, 2rem)",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          background:
                            "linear-gradient(45deg, #ff6b35, #ff8e53)",
                          border: "none",
                          padding:
                            "clamp(12px, 2vw, 15px) clamp(20px, 4vw, 40px)",
                          fontWeight: 600,
                          borderRadius: "25px",
                          color: "white",
                          transition: "all 0.3s ease",
                          boxShadow: "0 5px 15px rgba(255, 107, 53, 0.3)",
                          cursor: isStep1Valid() ? "pointer" : "not-allowed",
                          opacity: isStep1Valid() ? 1 : 0.6,
                          width: "100%",
                          maxWidth: "400px",
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                        }}
                        onClick={goToNextStep}
                        disabled={!isStep1Valid()}
                      >
                        Continue to Date & Time
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <div
                  style={{
                    background: "white",
                    padding: "clamp(1.5rem, 4vw, 2.5rem)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    zIndex: 1,
                    animation: "slideIn 0.5s ease-out",
                  }}
                >
                  <style>{`
                    @keyframes fadeIn {
                      from { opacity: 0; }
                      to { opacity: 1; }
                    }
                    
                    @media (max-width: 480px) {
                      .time-grid {
                        grid-template-columns: 1fr !important;
                      }
                    }
                    
                    @media (min-width: 481px) and (max-width: 768px) {
                      .time-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                      }
                    }
                  `}</style>

                  <h2
                    style={{
                      color: "#2a5298",
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    Select Date & Time
                  </h2>
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                      lineHeight: 1.5,
                    }}
                  >
                    Choose your preferred appointment slot
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(1.5rem, 3vw, 2rem)",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          marginBottom: "0.8rem",
                          color: "#2a5298",
                          fontSize: "clamp(1rem, 2vw, 1.2rem)",
                        }}
                      >
                        Select Date *
                      </h4>
                      {formErrors.appointmentDate && (
                        <span
                          style={{
                            color: "#f44336",
                            fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          {formErrors.appointmentDate}
                        </span>
                      )}
                      <input
                        type="date"
                        min={getMinDate()}
                        max={getMaxDate()}
                        value={formData.appointmentDate}
                        onChange={(e) => handleDateSelect(e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
                        style={{
                          width: "100%",
                          padding: "clamp(12px, 2vw, 15px)",
                          border: `2px solid ${
                            formErrors.appointmentDate ? "#f44336" : "#e9ecef"
                          }`,
                          borderRadius: "10px",
                          fontSize: "clamp(0.9rem, 2vw, 1rem)",
                          transition: "all 0.3s ease",
                          background: "#f8f9fa",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                          color: "#666",
                          marginTop: "8px",
                          lineHeight: 1.5,
                        }}
                      >
                        Select a date between{" "}
                        <strong>{getTodayDisplayDate()}</strong> and{" "}
                        <strong>{getMaxDisplayDate()}</strong>
                      </p>
                    </div>

                    {formData.appointmentDate && (
                      <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                        <h4
                          style={{
                            marginBottom: "0.8rem",
                            color: "#2a5298",
                            fontSize: "clamp(1rem, 2vw, 1.2rem)",
                          }}
                        >
                          Select Time Slot *
                        </h4>
                        {formErrors.timeSlot && (
                          <span
                            style={{
                              color: "#f44336",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                              display: "block",
                              marginBottom: "8px",
                            }}
                          >
                            {formErrors.timeSlot}
                          </span>
                        )}
                        <div
                          className="time-grid"
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "clamp(0.6rem, 1.5vw, 0.8rem)",
                            marginTop: "1rem",
                          }}
                        >
                          {timeZones.map((zone) => {
                            const isDisabled = isTimeZoneDisabled(zone);
                            return (
                              <div
                                key={zone.id}
                                onClick={() =>
                                  !isDisabled && handleTimeSelect(zone)
                                }
                                style={{
                                  padding: "clamp(10px, 2vw, 12px)",
                                  border: `2px solid ${
                                    formData.timeSlot === zone.label
                                      ? "#2a5298"
                                      : "#e9ecef"
                                  }`,
                                  borderRadius: "10px",
                                  textAlign: "center",
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
                                  transition: "all 0.3s ease",
                                  background: isDisabled
                                    ? "#f0f0f0"
                                    : formData.timeSlot === zone.label
                                    ? "#2a5298"
                                    : "#f8f9fa",
                                  color: isDisabled
                                    ? "#999"
                                    : formData.timeSlot === zone.label
                                    ? "white"
                                    : "inherit",
                                  fontWeight: 500,
                                  opacity: isDisabled ? 0.6 : 1,
                                  fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                                  minHeight: "60px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div>
                                  {zone.label}
                                  {isDisabled && (
                                    <div
                                      style={{
                                        fontSize: "0.7em",
                                        marginTop: "4px",
                                        color: "#666",
                                        fontWeight: "normal",
                                      }}
                                    >
                                      Not available
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "clamp(1.5rem, 3vw, 2rem)",
                      gap: "clamp(0.8rem, 2vw, 1rem)",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={goToPreviousStep}
                      style={{
                        background: "transparent",
                        border: "2px solid #6c757d",
                        color: "#6c757d",
                        padding:
                          "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                        borderRadius: "25px",
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        flex: "1 1 120px",
                        minWidth: "120px",
                        fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={goToNextStep}
                      disabled={!isStep2Valid()}
                      style={{
                        background: "linear-gradient(45deg, #ff6b35, #ff8e53)",
                        border: "none",
                        padding:
                          "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                        fontWeight: 600,
                        borderRadius: "25px",
                        color: "white",
                        transition: "all 0.3s ease",
                        boxShadow: "0 5px 15px rgba(255, 107, 53, 0.3)",
                        cursor: isStep2Valid() ? "pointer" : "not-allowed",
                        opacity: isStep2Valid() ? 1 : 0.6,
                        flex: "1 1 120px",
                        minWidth: "120px",
                        fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                      }}
                    >
                      Review Summary
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Summary */}
              {currentStep === 3 && (
                <div
                  style={{
                    background: "white",
                    padding: "clamp(1.5rem, 4vw, 2.5rem)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    zIndex: 1,
                    animation: "slideIn 0.5s ease-out",
                  }}
                >
                  <h2
                    style={{
                      color: "#2a5298",
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    Confirm Appointment
                  </h2>
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                      lineHeight: 1.5,
                    }}
                  >
                    Review your appointment details
                  </p>

                  <div>
                    <div
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "clamp(1.5rem, 3vw, 2rem)",
                        marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                        borderLeft: "4px solid #2a5298",
                      }}
                    >
                      <h4
                        style={{
                          color: "#2a5298",
                          marginBottom: "1rem",
                          fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                        }}
                      >
                        Appointment Summary
                      </h4>
                      <div style={{ marginTop: "1.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            padding: "0.8rem 0",
                            borderBottom: "1px solid #e9ecef",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2a5298",
                              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                            }}
                          >
                            Name:
                          </span>
                          <span
                            style={{
                              color: "#495057",
                              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            }}
                          >
                            {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            padding: "0.8rem 0",
                            borderBottom: "1px solid #e9ecef",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2a5298",
                              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                            }}
                          >
                            Email:
                          </span>
                          <span
                            style={{
                              color: "#495057",
                              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            }}
                          >
                            {formData.email}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            padding: "0.8rem 0",
                            borderBottom: "1px solid #e9ecef",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2a5298",
                              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                            }}
                          >
                            Phone:
                          </span>
                          <span
                            style={{
                              color: "#495057",
                              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            }}
                          >
                            {formData.phone}
                          </span>
                        </div>
                        {formData.alternate_contact_no && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.3rem",
                              padding: "0.8rem 0",
                              borderBottom: "1px solid #e9ecef",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#2a5298",
                                fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                              }}
                            >
                              Alternate Phone:
                            </span>
                            <span
                              style={{
                                color: "#495057",
                                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                              }}
                            >
                              {formData.alternate_contact_no}
                            </span>
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            padding: "0.8rem 0",
                            borderBottom: "1px solid #e9ecef",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2a5298",
                              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                            }}
                          >
                            Age & Gender:
                          </span>
                          <span
                            style={{
                              color: "#495057",
                              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            }}
                          >
                            {formData.age} years, {formData.gender}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            padding: "0.8rem 0",
                            borderBottom: "1px solid #e9ecef",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2a5298",
                              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                            }}
                          >
                            Appointment Date:
                          </span>
                          <span
                            style={{
                              color: "#495057",
                              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            }}
                          >
                            {formatDate(formData.appointmentDate)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            padding: "0.8rem 0",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#2a5298",
                              fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                            }}
                          >
                            Time Slot:
                          </span>
                          <span
                            style={{
                              color: "#495057",
                              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            }}
                          >
                            {formData.timeSlot}
                          </span>
                        </div>
                        {formData.concerns && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.3rem",
                              padding: "0.8rem 0",
                              marginTop: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#2a5298",
                                fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                              }}
                            >
                              Concerns:
                            </span>
                            <span
                              style={{
                                color: "#495057",
                                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                                lineHeight: 1.4,
                              }}
                            >
                              {formData.concerns}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "clamp(1.5rem, 3vw, 2rem)",
                        gap: "clamp(0.8rem, 2vw, 1rem)",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={goToPreviousStep}
                        style={{
                          background: "transparent",
                          border: "2px solid #6c757d",
                          color: "#6c757d",
                          padding:
                            "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                          borderRadius: "25px",
                          fontWeight: 600,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          flex: "1 1 120px",
                          minWidth: "120px",
                          fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                        }}
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                          background:
                            "linear-gradient(45deg, #ff6b35, #ff8e53)",
                          border: "none",
                          padding:
                            "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                          fontWeight: 600,
                          borderRadius: "25px",
                          color: "white",
                          transition: "all 0.3s ease",
                          boxShadow: "0 5px 15px rgba(255, 107, 53, 0.3)",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          opacity: isSubmitting ? 0.6 : 1,
                          flex: "1 1 120px",
                          minWidth: "120px",
                          fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                        }}
                      >
                        {isSubmitting ? "Submitting..." : "Confirm Appointment"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
