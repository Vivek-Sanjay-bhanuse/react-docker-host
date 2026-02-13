import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faUpload } from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import base_url from "../../../Config";
const VolunteerForm = ({ currentStep, setCurrentStep }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    experience: "0",
    joinDate: "",
    availability: "",
    skills: [],
    profilePhoto: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "info", message: "" });
  const [skillInput, setSkillInput] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);

  const validationRules = {
    name: {
      required: true,
      pattern: /^[A-Za-z\s]{2,50}$/,
      message: "Name must be 2-50 letters only",
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
    phone: {
      required: true,
      pattern: /^(?:\+?91|0)?[6789]\d{9}$/,
      message: "Please enter a valid 10-digit Indian mobile number",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    experience: {
      required: true,
      message: "Please select experience",
    },
    joinDate: {
      required: true,
      message: "Please select join date",
      validate: (value) => {
        const today = new Date().toISOString().split("T")[0];
        return value >= today;
      },
      invalidMessage: "Join date cannot be in the past",
    },
    availability: {
      required: true,
      message: "Please select availability",
    },
    skills: {
      required: true,
      message: "Please add at least one skill",
    },
    profilePhoto: {
      required: true,
      message: "Please upload profile photo",
    },
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    let error = "";

    if (rules.required) {
      if (name === "skills" && (!value || value.length === 0)) {
        error = rules.message;
      } else if (
        name !== "skills" &&
        (!value || value.toString().trim() === "")
      ) {
        error = rules.message;
      }
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message;
    }
    if (rules.validate && !rules.validate(value)) {
      return rules.invalidMessage;
    }
    return error;
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 1:
        ["name", "age", "gender", "phone", "email"].forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) {
            errors[field] = error;
            isValid = false;
          }
        });
        break;
      case 2:
        ["experience", "joinDate", "availability", "skills"].forEach(
          (field) => {
            const error = validateField(field, formData[field]);
            if (error) {
              errors[field] = error;
              isValid = false;
            }
          }
        );
        break;
      case 3:
        const photoError = validateField("profilePhoto", formData.profilePhoto);
        if (photoError) {
          errors.profilePhoto = photoError;
          isValid = false;
        }
        break;
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;
    if (name === "name") {
      cleanedValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name === "phone") {
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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      const newSkills = [...formData.skills, skillInput.trim()];
      setFormData((prev) => ({ ...prev, skills: newSkills }));
      setFormErrors((prev) => ({ ...prev, skills: "" }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    const newSkills = formData.skills.filter(
      (skill) => skill !== skillToRemove
    );
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
      setFormErrors((prev) => ({ ...prev, profilePhoto: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
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

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      experience: "0",
      joinDate: "",
      availability: "",
      skills: [],
      profilePhoto: null,
    });
    setFormErrors({});
    setTouchedFields({});
    setSkillInput("");
    setProfilePreview(null);
    setCurrentStep(1);
  };

  const submitVolunteer = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setAlertConfig({
        type: "error",
        message: "Please fix all validation errors before submitting.",
      });
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("mobile", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("join_date", formData.joinDate);
      formDataToSend.append("availability", formData.availability);
      formDataToSend.append("skills", formData.skills.join(","));
      if (formData.profilePhoto) {
        formDataToSend.append("document", formData.profilePhoto);
      }

      const response = await axios.post(
        `${base_url}api/volunteer/store`,
        formDataToSend
      );

      if (response.data.status === true) {
        setAlertConfig({
          type: "success",
          message: "Thank you for volunteering! We will contact you shortly.",
          onClose: () => {
            resetForm();
            setShowAlert(false);
          },
        });
        setShowAlert(true);
      }
    } catch (err) {
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
    const fields = ["name", "age", "gender", "phone", "email"];
    return fields.every((field) => !formErrors[field] && formData[field]);
  };

  const isStep2Valid = () => {
    const fields = ["experience", "joinDate", "availability", "skills"];
    return fields.every(
      (field) =>
        !formErrors[field] &&
        formData[field] &&
        (field !== "skills" || formData.skills.length > 0)
    );
  };

  const isStep3Valid = () => {
    return !formErrors.profilePhoto && formData.profilePhoto;
  };

  return (
    <>
      {showAlert && (
        <CustomAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => {
            alertConfig.onClose && alertConfig.onClose();
            setShowAlert(false);
          }}
          duration={3000}
        />
      )}

      {/* Progress Bar */}
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
              background: "linear-gradient(45deg, #2a5298, #1e40af)",
              transition: "width 0.5s ease",
              borderRadius: "2px",
              width: `${(currentStep - 1) * 33.33}%`,
            }}
          ></div>
        </div>

        {[1, 2, 3, 4].map((step) => (
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
              {step === 1 && "Basic Info"}
              {step === 2 && "Details"}
              {step === 3 && "Profile Photo"}
              {step === 4 && "Summary"}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
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
            Basic Information
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
            Tell us about yourself
          </p>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1rem, 3vw, 1.5rem)",
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
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                  border: `2px solid ${
                    formErrors.name ? "#f44336" : "#e9ecef"
                  }`,
                  borderRadius: "8px",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                  transition: "all 0.3s ease",
                  background: "#f8f9fa",
                  width: "100%",
                }}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                    marginTop: "5px",
                  }}
                >
                  {formErrors.name}
                </span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                  Age *
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
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
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
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
                  <option value="Prefer not to say">Prefer not to say</option>
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
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
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
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
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
                  background: "linear-gradient(45deg, #2a5298, #1e40af)",
                  border: "none",
                  padding: "clamp(12px, 2vw, 15px) clamp(20px, 4vw, 40px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(42, 82, 152, 0.3)",
                  cursor: isStep1Valid() ? "pointer" : "not-allowed",
                  opacity: isStep1Valid() ? 1 : 0.6,
                  width: "100%",
                  maxWidth: "400px",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                }}
                onClick={goToNextStep}
                disabled={!isStep1Valid()}
              >
                Continue to Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Experience and Details */}
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
          <h2
            style={{
              color: "#2a5298",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Experience & Availability
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
            Tell us about your volunteering preferences
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1.5rem, 3vw, 2rem)",
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
                Experience (Years) *
              </label>
              {formErrors.experience && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                    marginBottom: "5px",
                  }}
                >
                  {formErrors.experience}
                </span>
              )}
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span>0</span>
                <input
                  type="range"
                  name="experience"
                  min="0"
                  max="20"
                  value={formData.experience}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{
                    flex: 1,
                    height: "6px",
                    background:
                      "linear-gradient(90deg, #e9ecef 0%, #2a5298 100%)",
                    borderRadius: "3px",
                    outline: "none",
                  }}
                />
                <span>20+</span>
              </div>
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <span style={{ fontWeight: 600, color: "#2a5298" }}>
                  {formData.experience} years
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                  Preferred Join Date *
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                    border: `2px solid ${
                      formErrors.joinDate ? "#f44336" : "#e9ecef"
                    }`,
                    borderRadius: "8px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    width: "100%",
                  }}
                />
                {formErrors.joinDate && (
                  <span
                    style={{
                      color: "#f44336",
                      fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                      marginTop: "5px",
                    }}
                  >
                    {formErrors.joinDate}
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
                  Availability *
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                    border: `2px solid ${
                      formErrors.availability ? "#f44336" : "#e9ecef"
                    }`,
                    borderRadius: "8px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    width: "100%",
                  }}
                >
                  <option value="">Select availability</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Evenings">Evenings only</option>
                </select>
                {formErrors.availability && (
                  <span
                    style={{
                      color: "#f44336",
                      fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                      marginTop: "5px",
                    }}
                  >
                    {formErrors.availability}
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
                Skills *
              </label>
              {formErrors.skills && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                    marginBottom: "5px",
                  }}
                >
                  {formErrors.skills}
                </span>
              )}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                  minHeight: "50px",
                  padding: "0.5rem",
                  border: `2px solid ${
                    formErrors.skills ? "#f44336" : "#e9ecef"
                  }`,
                  borderRadius: "8px",
                  background: "#f8f9fa",
                }}
              >
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#2a5298",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  style={{
                    flex: 1,
                    padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px)",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                  }}
                  placeholder="Type a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={handleSkillAdd}
                  style={{
                    padding: "clamp(10px, 2vw, 12px) 20px",
                    background: "#2a5298",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
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
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
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
                  background: "linear-gradient(45deg, #2a5298, #1e40af)",
                  border: "none",
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(42, 82, 152, 0.3)",
                  cursor: isStep2Valid() ? "pointer" : "not-allowed",
                  opacity: isStep2Valid() ? 1 : 0.6,
                  flex: "1 1 120px",
                  minWidth: "120px",
                  fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                }}
              >
                Continue to Profile Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Profile Photo */}
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
            Profile Photo
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
            Upload a clear photo of yourself
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {profilePreview ? (
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "4px solid #e9ecef",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "#f8f9fa",
                    border: "4px dashed #e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    style={{ fontSize: "3rem", color: "#999" }}
                  />
                </div>
              )}

              <label
                htmlFor="profilePhoto"
                style={{
                  background: "linear-gradient(45deg, #2a5298, #1e40af)",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  display: "inline-block",
                }}
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{ marginRight: "8px" }}
                />
                Choose Profile Photo
              </label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {formErrors.profilePhoto && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
                    marginTop: "10px",
                  }}
                >
                  {formErrors.profilePhoto}
                </span>
              )}
              <p
                style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}
              >
                Supported formats: JPG, PNG (Max 5MB)
              </p>
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
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
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
                disabled={!isStep3Valid()}
                style={{
                  background: "linear-gradient(45deg, #2a5298, #1e40af)",
                  border: "none",
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(42, 82, 152, 0.3)",
                  cursor: isStep3Valid() ? "pointer" : "not-allowed",
                  opacity: isStep3Valid() ? 1 : 0.6,
                  flex: "1 1 120px",
                  minWidth: "120px",
                  fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                }}
              >
                Review Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {currentStep === 4 && (
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
            Confirm Volunteer Application
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
            Review your application details
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
                Volunteer Application Summary
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
                    {formData.name}
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
                    Experience:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                    }}
                  >
                    {formData.experience} years
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
                    Join Date:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                    }}
                  >
                    {formData.joinDate}
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
                    Availability:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                    }}
                  >
                    {formData.availability}
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
                    Skills:
                  </span>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#2a5298",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
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
                    Profile Photo:
                  </span>
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile Preview Small"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #e9ecef",
                        marginTop: "0.5rem",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#495057",
                        fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                      }}
                    >
                      Not uploaded
                    </span>
                  )}
                </div>
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
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
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
                onClick={submitVolunteer}
                disabled={isSubmitting}
                style={{
                  background: "linear-gradient(45deg, #2a5298, #1e40af)",
                  border: "none",
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(42, 82, 152, 0.3)",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  flex: "1 1 120px",
                  minWidth: "120px",
                  fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VolunteerForm;
