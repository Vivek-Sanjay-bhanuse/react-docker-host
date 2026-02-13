import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faQrcode } from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import base_url from "../../../Config";

const DonateForm = ({ currentStep, setCurrentStep }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    customAmount: "",
    receipt: null,
    paymentScreenshot: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "info", message: "" });
  const [previewImage, setPreviewImage] = useState(null);

  const donationAmounts = [500, 1000, 2500, 5000, 10000];

  const validationRules = {
    name: {
      required: true,
      pattern: /^[A-Za-z\s]{2,50}$/,
      message: "Name must be 2-50 letters only",
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
    amount: {
      required: true,
      message: "Please select or enter an amount",
    },
    paymentScreenshot: {
      required: true,
      message: "Please upload payment screenshot",
    },
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    let error = "";

    if (rules.required && (!value || value.toString().trim() === "")) {
      error = rules.message;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message;
    }

    return error;
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 1:
        ["name", "email", "phone", "amount"].forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) {
            errors[field] = error;
            isValid = false;
          }
        });
        break;
      case 2:
        const screenshotError = validateField(
          "paymentScreenshot",
          formData.paymentScreenshot
        );
        if (screenshotError) {
          errors.paymentScreenshot = screenshotError;
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
    } else if (name === "amount" || name === "customAmount") {
      cleanedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
      ...(name === "customAmount" && { amount: "custom" }),
    }));

    if (touchedFields[name]) {
      const error = validateField(name, cleanedValue);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleAmountSelect = (amount) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
      customAmount: "",
    }));
    setFormErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, paymentScreenshot: file }));
      setFormErrors((prev) => ({ ...prev, paymentScreenshot: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
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
      email: "",
      phone: "",
      amount: "",
      customAmount: "",
      receipt: null,
      paymentScreenshot: null,
    });
    setFormErrors({});
    setTouchedFields({});
    setPreviewImage(null);
    setCurrentStep(1);
  };

  const submitDonation = async () => {
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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append(
        "amount",
        formData.amount === "custom" ? formData.customAmount : formData.amount
      );
      if (formData.paymentScreenshot) {
        formDataToSend.append("receipt", formData.paymentScreenshot);
      }

      const response = await axios.post(
        `${base_url}api/donation/store`,
        formDataToSend
      );

      if (response.data.status === true ) {
        setAlertConfig({
          type: "success",
          message:
            "Thank you for your donation! Your contribution will make a difference.",
          onClose: () => {
            resetForm();
            setShowAlert(false);
          },
        });
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Donation submission error:", err);
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
    const fields = ["name", "email", "phone", "amount"];
    return fields.every((field) => !formErrors[field] && formData[field]);
  };

  const isStep2Valid = () => {
    return !formErrors.paymentScreenshot && formData.paymentScreenshot;
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

      {/* Progress Bar - Now only 3 steps */}
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
              {step === 2 && "Payment"}
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
            padding: "clamp(1rem, 3vw, 2.5rem)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            position: "relative",
            zIndex: 1,
            animation: "slideIn 0.5s ease-out",
            margin: "0 10px",
          }}
        >
          <style>{`
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(50px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @media (max-width: 768px) {
              .form-grid {
                grid-template-columns: 1fr !important;
              }
              .amount-grid {
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)) !important;
              }
            }
            @media (max-width: 480px) {
              .amount-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>

          <h2
            style={{
              color: "#2a5298",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Donation Details
          </h2>
          <p
            style={{
              color: "#6c757d",
              textAlign: "center",
              marginBottom: "clamp(1rem, 3vw, 2rem)",
              fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
              lineHeight: 1.5,
            }}
          >
            Your generosity makes a difference
          </p>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(0.8rem, 3vw, 1.5rem)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontWeight: 600,
                  color: "#2a5298",
                  marginBottom: "0.5rem",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
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
                  padding: "clamp(8px, 2vw, 12px) clamp(10px, 2vw, 15px)",
                  border: `2px solid ${
                    formErrors.name ? "#f44336" : "#e9ecef"
                  }`,
                  borderRadius: "8px",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  transition: "all 0.3s ease",
                  background: "#f8f9fa",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                    marginTop: "5px",
                  }}
                >
                  {formErrors.name}
                </span>
              )}
            </div>

            <div
              className="form-grid"
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
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
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
                    padding: "clamp(8px, 2vw, 12px) clamp(10px, 2vw, 15px)",
                    border: `2px solid ${
                      formErrors.email ? "#f44336" : "#e9ecef"
                    }`,
                    borderRadius: "8px",
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  placeholder="example@email.com"
                />
                {formErrors.email && (
                  <span
                    style={{
                      color: "#f44336",
                      fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
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
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
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
                    padding: "clamp(8px, 2vw, 12px) clamp(10px, 2vw, 15px)",
                    border: `2px solid ${
                      formErrors.phone ? "#f44336" : "#e9ecef"
                    }`,
                    borderRadius: "8px",
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {formErrors.phone && (
                  <span
                    style={{
                      color: "#f44336",
                      fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                      marginTop: "5px",
                    }}
                  >
                    {formErrors.phone}
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
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                }}
              >
                Donation Amount *
              </label>
              {formErrors.amount && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                    marginBottom: "5px",
                  }}
                >
                  {formErrors.amount}
                </span>
              )}

              <div
                className="amount-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                  gap: "0.8rem",
                  marginBottom: "1rem",
                }}
              >
                {donationAmounts.map((amount) => (
                  <div
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    style={{
                      padding: "10px",
                      border: `2px solid ${
                        formData.amount === amount.toString()
                          ? "#2a5298"
                          : "#e9ecef"
                      }`,
                      borderRadius: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      background:
                        formData.amount === amount.toString()
                          ? "#2a5298"
                          : "#f8f9fa",
                      color:
                        formData.amount === amount.toString()
                          ? "white"
                          : "inherit",
                      fontWeight: 500,
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    }}
                  >
                    ₹ {amount.toLocaleString()}
                  </div>
                ))}
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  checked={formData.amount === "custom"}
                  onChange={() => {
                    if (formData.amount === "custom") {
                      setFormData((prev) => ({
                        ...prev,
                        amount: "",
                        customAmount: "",
                      }));
                    } else {
                      setFormData((prev) => ({ ...prev, amount: "custom" }));
                    }
                  }}
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
                <span style={{ fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}>
                  Custom Amount
                </span>
              </div>

              {formData.amount === "custom" && (
                <div style={{ marginTop: "0.8rem" }}>
                  <input
                    type="text"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    style={{
                      padding: "clamp(8px, 2vw, 12px) clamp(10px, 2vw, 15px)",
                      border: `2px solid #e9ecef`,
                      borderRadius: "8px",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      transition: "all 0.3s ease",
                      background: "#f8f9fa",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter custom amount"
                  />
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "clamp(1rem, 3vw, 2rem)",
              }}
            >
              <button
                type="button"
                style={{
                  background: "linear-gradient(45deg, #ff6b35, #ff8e53)",
                  border: "none",
                  padding: "clamp(10px, 2vw, 12px) clamp(16px, 4vw, 40px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(255, 107, 53, 0.3)",
                  cursor: isStep1Valid() ? "pointer" : "not-allowed",
                  opacity: isStep1Valid() ? 1 : 0.6,
                  width: "100%",
                  maxWidth: "400px",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                }}
                onClick={goToNextStep}
                disabled={!isStep1Valid()}
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Payment QR Code */}
      {currentStep === 2 && (
        <div
          style={{
            background: "white",
            padding: "clamp(1rem, 3vw, 2.5rem)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            position: "relative",
            zIndex: 1,
            animation: "slideIn 0.5s ease-out",
            margin: "0 10px",
          }}
        >
          <h2
            style={{
              color: "#2a5298",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Make Payment
          </h2>
          <p
            style={{
              color: "#6c757d",
              textAlign: "center",
              marginBottom: "clamp(1rem, 3vw, 2rem)",
              fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
              lineHeight: 1.5,
            }}
          >
            Scan the QR code to make payment
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1rem, 3vw, 2rem)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                background: "#f8f9fa",
                padding: "clamp(1rem, 2vw, 2rem)",
                borderRadius: "15px",
                border: "2px dashed #e9ecef",
              }}
            >
              <FontAwesomeIcon
                icon={faQrcode}
                style={{
                  fontSize: "clamp(3rem, 6vw, 4rem)",
                  color: "#2a5298",
                  marginBottom: "1rem",
                  opacity: 0.7,
                }}
              />
              <p
                style={{
                  color: "#666",
                  marginBottom: "1rem",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                }}
              >
                Amount to pay: ₹
                {formData.amount === "custom"
                  ? formData.customAmount
                  : formData.amount}
              </p>
              <div
                style={{
                  width: "clamp(150px, 40vw, 200px)",
                  height: "clamp(150px, 40vw, 200px)",
                  background: "#fff",
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                  fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                }}
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=test@upi&pn=Donation"
                  alt="Donation QR"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <p
                style={{
                  color: "#666",
                  fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                  marginTop: "1rem",
                }}
              >
                Scan this QR code with any UPI app
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontWeight: 600,
                  color: "#2a5298",
                  marginBottom: "0.5rem",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                }}
              >
                Upload Payment Screenshot *
              </label>
              {formErrors.paymentScreenshot && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                    marginBottom: "5px",
                  }}
                >
                  {formErrors.paymentScreenshot}
                </span>
              )}
              <div
                style={{
                  border: `2px dashed ${
                    formErrors.paymentScreenshot ? "#f44336" : "#e9ecef"
                  }`,
                  borderRadius: "10px",
                  padding: "clamp(1rem, 2vw, 2rem)",
                  textAlign: "center",
                  background: "#f8f9fa",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() =>
                  document.getElementById("paymentScreenshot").click()
                }
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    color: "#2a5298",
                    marginBottom: "1rem",
                    opacity: 0.7,
                  }}
                />
                <p
                  style={{
                    color: "#666",
                    marginBottom: "0.5rem",
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  }}
                >
                  Click to upload payment screenshot
                </p>
                <p
                  style={{
                    color: "#999",
                    fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)",
                  }}
                >
                  Supported formats: JPG, PNG (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                id="paymentScreenshot"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {previewImage && (
                <div style={{ marginTop: "1rem" }}>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#2a5298",
                      marginBottom: "0.5rem",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                    }}
                  >
                    Preview:
                  </p>
                  <div
                    style={{
                      width: "clamp(120px, 30vw, 200px)",
                      height: "clamp(120px, 30vw, 200px)",
                      border: "2px solid #e9ecef",
                      borderRadius: "10px",
                      overflow: "hidden",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "clamp(1rem, 3vw, 2rem)",
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
                  padding: "clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)",
                  borderRadius: "25px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  flex: "1 1 100px",
                  minWidth: "100px",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
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
                  padding: "clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(255, 107, 53, 0.3)",
                  cursor: isStep2Valid() ? "pointer" : "not-allowed",
                  opacity: isStep2Valid() ? 1 : 0.6,
                  flex: "1 1 100px",
                  minWidth: "100px",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                }}
              >
                Continue to Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Summary (Now step 3 instead of 4) */}
      {currentStep === 3 && (
        <div
          style={{
            background: "white",
            padding: "clamp(1rem, 3vw, 2.5rem)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            position: "relative",
            zIndex: 1,
            animation: "slideIn 0.5s ease-out",
            margin: "0 10px",
          }}
        >
          <h2
            style={{
              color: "#2a5298",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Confirm Donation
          </h2>
          <p
            style={{
              color: "#6c757d",
              textAlign: "center",
              marginBottom: "clamp(1rem, 3vw, 2rem)",
              fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
              lineHeight: 1.5,
            }}
          >
            Review your donation details
          </p>

          <div>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "15px",
                padding: "clamp(1rem, 3vw, 2rem)",
                marginBottom: "clamp(1rem, 3vw, 2rem)",
                borderLeft: "4px solid #2a5298",
              }}
            >
              <h4
                style={{
                  color: "#2a5298",
                  marginBottom: "1rem",
                  fontSize: "clamp(1rem, 2vw, 1.3rem)",
                }}
              >
                Donation Summary
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
                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                    }}
                  >
                    Name:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
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
                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                    }}
                  >
                    Email:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
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
                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                    }}
                  >
                    Phone:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
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
                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                    }}
                  >
                    Donation Amount:
                  </span>
                  <span
                    style={{
                      color: "#495057",
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                      fontWeight: "bold",
                    }}
                  >
                    ₹
                    {formData.amount === "custom"
                      ? formData.customAmount
                      : formData.amount}
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
                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                    }}
                  >
                    Payment Status:
                  </span>
                  <span
                    style={{
                      color: formData.paymentScreenshot ? "#28a745" : "#f44336",
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                      fontWeight: 600,
                    }}
                  >
                    {formData.paymentScreenshot
                      ? "Screenshot Uploaded ✓"
                      : "Pending"}
                  </span>
                </div>
                {previewImage && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                      padding: "0.8rem 0",
                      marginTop: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#2a5298",
                        fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                      }}
                    >
                      Screenshot Preview:
                    </span>
                    <div
                      style={{
                        width: "clamp(100px, 25vw, 150px)",
                        height: "clamp(100px, 25vw, 150px)",
                        border: "2px solid #e9ecef",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginTop: "0.5rem",
                      }}
                    >
                      <img
                        src={previewImage}
                        alt="Payment Screenshot"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "clamp(1rem, 3vw, 2rem)",
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
                  padding: "clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)",
                  borderRadius: "25px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  flex: "1 1 100px",
                  minWidth: "100px",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                }}
              >
                Back
              </button>
              <button
                onClick={submitDonation}
                disabled={isSubmitting}
                style={{
                  background: "linear-gradient(45deg, #ff6b35, #ff8e53)",
                  border: "none",
                  padding: "clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)",
                  fontWeight: 600,
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 15px rgba(255, 107, 53, 0.3)",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  flex: "1 1 100px",
                  minWidth: "100px",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                }}
              >
                {isSubmitting ? "Submitting..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonateForm;
