import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faLock,
  faSignInAlt,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import { useNavigate } from "react-router-dom";
import EMImage from "../../../assets/images/Gemini_Generated_Image_szxcufszxcufszxc.png";
import EMILogo from "../../../assets/images/empathy_image_old-removebg-preview - Copy.png"

// Inline CSS for login page
const loginStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  floatingOrbs: {
    position: "absolute",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
    animation: "floatOrbs 8s ease-in-out infinite",
  },
  floatingOrb1: {
    width: "200px",
    height: "200px",
    top: "10%",
    left: "10%",
    animationDelay: "0s",
  },
  floatingOrb2: {
    width: "150px",
    height: "150px",
    top: "20%",
    right: "15%",
    animationDelay: "2s",
  },
  floatingOrb3: {
    width: "100px",
    height: "100px",
    bottom: "20%",
    left: "20%",
    animationDelay: "4s",
  },
  twoCardContainer: {
    display: "flex",
    width: "100%",
    maxWidth: "1000px",
    minHeight: "600px",
    borderRadius: "25px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
    background: "white",
  },
  leftCard: {
    flex: 1,
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    position: "relative",
    overflow: "hidden",
  },
  rightCard: {
    flex: 1,
    background: "linear-gradient(135deg, #2d365b 0%, #1e2a4b 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px 40px",
    position: "relative",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    maxWidth: "300px",
  },
  logoImage: {
    width: "100%",
    height: "auto",
  },
  slogan: {
    color: "#2d365b",
    fontSize: "18px",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: "1.5",
    opacity: "0.9",
  },
  shimmerEffect: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
    transform: "rotate(45deg)",
    animation: "shimmerSlide 6s ease-in-out infinite",
  },
  inputContainer: {
    position: "relative",
    marginBottom: "25px",
  },
  inputIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#7883ae",
    fontSize: "18px",
    transition: "all 0.3s ease",
    zIndex: 2,
  },
  inputField: {
    width: "100%",
    padding: "15px 50px 15px 50px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "15px",
    fontSize: "16px",
    background: "rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    outline: "none",
    position: "relative",
    zIndex: 1,
    color: "white",
  },
  inputFieldPlaceholder: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  inputFocus: {
    borderColor: "rgba(255, 255, 255, 0.5)",
    boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.1)",
    transform: "translateY(-2px)",
    background: "rgba(255, 255, 255, 0.15)",
  },
  iconFocus: {
    color: "white",
    transform: "translateY(-50%) scale(1.1)",
  },
  passwordToggle: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.7)",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    zIndex: 2,
    padding: "5px",
    borderRadius: "5px",
  },
  passwordToggleHover: {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  loginButton: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    color: "#2d365b",
    border: "none",
    borderRadius: "15px",
    padding: "16px 20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  loginButtonHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 15px 30px rgba(255, 255, 255, 0.2)",
  },
  buttonShine: {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "50%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(45, 54, 91, 0.3), transparent)",
    animation: "shine 2s infinite",
  },
  loadingSpinner: {
    border: "2px solid transparent",
    borderTop: "2px solid #2d365b",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: "10px",
  },
  welcomeSubtitle: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: "30px",
  },
  logoContainer: {
    width: "200px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
  },
  rightLogoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
  },
};

// Keyframes for animations
const LoginKeyframes = () => (
  <style>
    {`
      @keyframes floatOrbs {
        0%, 100% {
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translateY(-30px) translateX(20px) scale(1.1);
          opacity: 0.5;
        }
        50% {
          transform: translateY(15px) translateX(-15px) scale(0.9);
          opacity: 0.4;
        }
        75% {
          transform: translateY(-25px) translateX(-20px) scale(1.05);
          opacity: 0.6;
        }
      }
      
      @keyframes shimmerSlide {
        0% {
          transform: rotate(45deg) translateX(-100%) translateY(-100%);
        }
        50% {
          transform: rotate(45deg) translateX(100%) translateY(100%);
        }
        100% {
          transform: rotate(45deg) translateX(-100%) translateY(-100%);
        }
      }
      
      @keyframes shine {
        0% {
          left: -100%;
        }
        100% {
          left: 200%;
        }
      }
      
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out;
      }
      
      .animate-slide-in-down {
        animation: slideInDown 0.8s ease-out;
      }
      
      .animate-slide-in-left {
        animation: slideInLeft 0.8s ease-out;
      }
      
      .animate-slide-in-right {
        animation: slideInRight 0.8s ease-out;
      }
      
      @media (max-width: 768px) {
        .two-card-container {
          flex-direction: column;
          min-height: auto;
        }
        
        .left-card {
          padding: 30px 20px;
        }
        
        .right-card {
          padding: 40px 20px;
        }
      }

      /* Placeholder color for dark background */
      input::placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      input:-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      input::-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
      }
    `}
  </style>
);

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordToggleHovered, setIsPasswordToggleHovered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "error",
    message: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showCustomAlert = (type, message) => {
    setAlertConfig({
      type,
      message,
    });
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      showCustomAlert("error", "Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(credentials.username, credentials.password);
      if (!result.success) {
        showCustomAlert(
          "error",
          result.error || "Login failed. Please check your credentials."
        );
      } else {
        showCustomAlert("success", "Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin");
        }, 3000);
      }
    } catch (error) {
      showCustomAlert(
        "error",
        "An unexpected error occurred. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <LoginKeyframes />

      {/* Custom Alert */}
      {showAlert && (
        <CustomAlert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={handleCloseAlert}
          duration={3000}
        />
      )}

      <div style={loginStyles.container} className="border">
        {/* Floating Background Orbs */}
        <div
          style={{ ...loginStyles.floatingOrbs, ...loginStyles.floatingOrb1 }}
        ></div>
        <div
          style={{ ...loginStyles.floatingOrbs, ...loginStyles.floatingOrb2 }}
        ></div>
        <div
          style={{ ...loginStyles.floatingOrbs, ...loginStyles.floatingOrb3 }}
        ></div>

        {/* Two Card Container */}
        <div
          style={loginStyles.twoCardContainer}
          className="two-card-container  border border-black/80 rounded-2xl  shadow-xl"
        >
          {/* Left Card - Image and Slogan (Now White Background) */}
          <div style={loginStyles.leftCard} className="animate-slide-in-left">
            <div style={loginStyles.imageContainer}>
              <img
                src={EMImage}
                alt="Empathy Foundation"
                style={loginStyles.logoImage}
              />

             
            </div>

            <div style={loginStyles.slogan}>
              Making a Difference in Our Community Through Compassion and Care
            </div>
          </div>

          {/* Right Card - Login Form (Now Dark Blue Background) */}
          <div style={loginStyles.rightCard} className="animate-slide-in-right">
            {/* Shimmer Effect */}
            <div style={loginStyles.shimmerEffect}></div>

            {/* Header */}
            <div className="text-center mb-8 animate-slide-in-down">
              <div style={loginStyles.logoContainer}>
                <img
                  src={EMILogo}
                  alt="Empathy Foundation"
                  style={loginStyles.rightLogoImage}
                />
              </div>
              <h1 style={loginStyles.welcomeTitle}>Welcome Back</h1>
              <p style={loginStyles.welcomeSubtitle}>
                Sign in to your admin dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div style={loginStyles.inputContainer}>
                <div
                  style={{
                    ...loginStyles.inputIcon,
                    ...(focusedField === "username"
                      ? loginStyles.iconFocus
                      : {}),
                  }}
                >
                  <FontAwesomeIcon icon={faUserShield} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...loginStyles.inputField,
                    ...(focusedField === "username"
                      ? loginStyles.inputFocus
                      : {}),
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div style={loginStyles.inputContainer}>
                <div
                  style={{
                    ...loginStyles.inputIcon,
                    ...(focusedField === "password"
                      ? loginStyles.iconFocus
                      : {}),
                  }}
                >
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...loginStyles.inputField,
                    ...(focusedField === "password"
                      ? loginStyles.inputFocus
                      : {}),
                  }}
                  disabled={isLoading}
                />
                {/* Password Toggle Button */}
                <button
                  type="button"
                  style={{
                    ...loginStyles.passwordToggle,
                    ...(isPasswordToggleHovered
                      ? loginStyles.passwordToggleHover
                      : {}),
                    ...(focusedField === "password"
                      ? { color: "white" }
                      : {}),
                  }}
                  onClick={togglePasswordVisibility}
                  onMouseEnter={() => setIsPasswordToggleHovered(true)}
                  onMouseLeave={() => setIsPasswordToggleHovered(false)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                style={loginStyles.loginButton}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow =
                      "0 15px 30px rgba(255, 255, 255, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div style={loginStyles.loadingSpinner}></div>
                ) : (
                  <>
                    <div style={loginStyles.buttonShine}></div>
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    Login to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Footer Note */}
            <div className="text-center mt-6">
              <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                Secure access to Empathy Foundation admin panel
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;