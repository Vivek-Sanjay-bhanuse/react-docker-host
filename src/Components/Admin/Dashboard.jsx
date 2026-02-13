import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faUserFriends,
  faCalendarAlt,
  faImages,
  faArrowUp,
  faArrowDown,
  faDonate,
  faUserPlus,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import base_url from "../../Config";

// Inline CSS for custom animations and effects
const dashboardStyles = {
  container: {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    minHeight: "100vh",
    padding: "15px",
  },
  headerCard: {
    background: "linear-gradient(135deg, #2d365b 0%, #1e2a4b 100%)",
    borderRadius: "20px",
    padding: "35px 25px",
    position: "relative",
    overflow: "hidden",
    margin: "0 auto 30px auto",
    maxWidth: "1100px",
    boxShadow: "0 15px 40px rgba(45, 54, 91, 0.25)",
    border: "2px solid rgba(255, 255, 255, 0.1)",
  },
  floatingOrbs: {
    position: "absolute",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
    animation: "floatOrbs 8s ease-in-out infinite",
  },
  floatingOrb1: {
    width: "100px",
    height: "100px",
    top: "-25px",
    left: "8%",
    animationDelay: "0s",
  },
  floatingOrb2: {
    width: "70px",
    height: "70px",
    top: "15%",
    right: "12%",
    animationDelay: "2s",
  },
  floatingOrb3: {
    width: "50px",
    height: "50px",
    bottom: "-15px",
    left: "15%",
    animationDelay: "4s",
  },
  floatingOrb4: {
    width: "80px",
    height: "80px",
    bottom: "8%",
    right: "8%",
    animationDelay: "6s",
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
  statCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    cursor: "pointer",
  },
  statCardHover: {
    border: "2px solid #2d365b",
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(45, 54, 91, 0.12)",
  },
  hoverOverlay: {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, #2d365b 0%, #1e2a4b 100%)",
    transition: "left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    zIndex: 1,
  },
  hoverOverlayActive: {
    left: "0",
  },
  cornerAccent: {
    position: "absolute",
    top: "0",
    right: "0",
    width: "50px",
    height: "50px",
    background:
      "linear-gradient(135deg, transparent 50%, rgba(120, 131, 174, 0.1) 50%)",
    borderBottomLeftRadius: "15px",
    transition: "all 0.4s ease",
  },
  cornerAccentHover: {
    background:
      "linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, 0.2) 50%)",
  },
  iconContainer: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "15px",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
    boxShadow: "0 6px 15px rgba(102, 126, 234, 0.25)",
    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    position: "relative",
    zIndex: 2,
  },
  iconContainerHover: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    color: "#2d365b",
    transform: "scale(1.08) rotate(5deg)",
  },
  dataCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
    border: "2px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.06)",
    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  dataCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
    borderColor: "#667eea",
  },
  graphContainer: {
    background: "linear-gradient(135deg, #2d365b 0%, #1e2a4b 100%)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  graphContainerHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(45, 54, 91, 0.25)",
  },
  progressBar: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    height: "8px",
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    position: "relative",
    overflow: "hidden",
  },
  progressShine: {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "50%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    animation: "shine 2s infinite",
  },
};

// Keyframes as style component
const KeyframesStyles = () => (
  <style>
    {`
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
      
      @keyframes slideInFromLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInFromRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes countUp {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }
        50% {
          box-shadow: 0 0 25px rgba(102, 126, 234, 0.5);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      
      @keyframes textWave {
        0%, 100% {
          transform: translateY(0px);
        }
        25% {
          transform: translateY(-2px);
        }
        50% {
          transform: translateY(0px);
        }
        75% {
          transform: translateY(2px);
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
      
      @keyframes barGrow {
        from {
          transform: scaleY(0);
          opacity: 0;
        }
        to {
          transform: scaleY(1);
          opacity: 1;
        }
      }
      
      @keyframes floatOrbs {
        0%, 100% {
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.6;
        }
        25% {
          transform: translateY(-15px) translateX(12px) scale(1.1);
          opacity: 0.8;
        }
        50% {
          transform: translateY(8px) translateX(-8px) scale(0.9);
          opacity: 0.7;
        }
        75% {
          transform: translateY(-12px) translateX(-12px) scale(1.05);
          opacity: 0.9;
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
      
      @keyframes titleGlow {
        0%, 100% {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
                       0 0 30px rgba(255, 255, 255, 0.2),
                       0 0 45px rgba(255, 255, 255, 0.1);
        }
        50% {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.6),
                       0 0 40px rgba(255, 255, 255, 0.3),
                       0 0 60px rgba(255, 255, 255, 0.15);
        }
      }
      
      @keyframes subtitlePulse {
        0%, 100% {
          opacity: 0.8;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.01);
        }
      }
      
      .animate-text-wave {
        animation: textWave 3s ease-in-out infinite;
      }
      
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      
      .animate-title-glow {
        animation: titleGlow 4s ease-in-out infinite;
      }
      
      .animate-subtitle-pulse {
        animation: subtitlePulse 3s ease-in-out infinite;
      }
    `}
  </style>
);

const StatsCard = ({ title, value, icon, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end =
        typeof value === "number"
          ? value
          : parseFloat(value.toString().replace(/,/g, "")) || 0;
      const duration = 2000;

      if (end === 0) {
        setAnimatedValue(0);
        setHasAnimated(true);
        return;
      }

      const startTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * end);

        setAnimatedValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedValue(end);
          setHasAnimated(true);
        }
      };

      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const formatValue = (val) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + "M";
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + "K";
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div
      style={{
        ...dashboardStyles.statCard,
        ...(isHovered ? dashboardStyles.statCardHover : {}),
        animation: `fadeInUp 0.8s ease-out ${delay}ms both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      {/* Hover overlay that slides from left to right */}
      <div
        style={{
          ...dashboardStyles.hoverOverlay,
          ...(isHovered ? dashboardStyles.hoverOverlayActive : {}),
        }}
      ></div>

      {/* Corner accent */}
      <div
        style={{
          ...dashboardStyles.cornerAccent,
          ...(isHovered ? dashboardStyles.cornerAccentHover : {}),
        }}
      ></div>

      <div className="flex items-center justify-between relative z-2">
        <div className="flex-1 relative z-2">
          <div
            style={{
              animation: `countUp 0.8s ease-out ${delay + 300}ms both`,
            }}
          >
            <h3
              className={`text-2xl font-bold mb-1 transition-all duration-500 ${
                isHovered ? "text-white transform scale-105" : "text-[#2d365b]"
              }`}
            >
              {hasAnimated ? formatValue(animatedValue) : "0"}
            </h3>
            <p
              className={`text-xs font-semibold transition-all duration-500 ${
                isHovered
                  ? "text-gray-200 transform translateX(2px)"
                  : "text-[#7883ae]"
              }`}
            >
              {title}
            </p>
          </div>
        </div>
        <div
          style={{
            ...dashboardStyles.iconContainer,
            ...(isHovered ? dashboardStyles.iconContainerHover : {}),
            animation: `fadeInUp 0.8s ease-out ${delay + 200}ms both`,
          }}
          className="group-hover:animate-pulseGlow"
        >
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </div>
  );
};

const DataItem = ({ icon, title, value, time, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...dashboardStyles.dataCard,
        ...(isHovered ? dashboardStyles.dataCardHover : {}),
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center space-x-2"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base transition-all duration-400"
        style={{
          background: color,
          transform: isHovered ? "scale(1.08) rotate(5deg)" : "scale(1)",
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="flex-1">
        <p
          className={`text-xs font-semibold transition-colors duration-400 ${
            isHovered ? "text-[#667eea]" : "text-[#2d365b]"
          }`}
        >
          {value}
        </p>
        <p className="text-base font-bold text-[#2d365b]  transition-all duration-400">
          {title}
        </p>
        <p className="text-xs text-[#7883ae]  transition-colors duration-400">
          {time}
        </p>
      </div>
    </div>
  );
};

const AnimatedBarChart = ({ data, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div
      style={{
        ...dashboardStyles.graphContainer,
        ...(isHovered ? dashboardStyles.graphContainerHover : {}),
        animation: `fadeInUp 0.8s ease-out ${delay}ms both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          {color.includes("#f47058") ? "Monthly Donations" : "Volunteer Growth"}
        </h3>
        <div
          className={`text-xl transition-transform duration-500 ${
            isHovered ? "animate-float" : ""
          }`}
        >
          {color.includes("#f47058") ? "💰" : "👥"}
        </div>
      </div>

      <div className="flex items-end justify-between h-40 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="text-xs text-gray-300 mb-2 transition-all duration-500"
              style={{
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              {item.label}
            </div>
            <div className="relative w-full h-32 flex items-end">
              <div
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  background: color,
                  width: "100%",
                  borderRadius: "6px 6px 0 0",
                  transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  transformOrigin: "bottom",
                  animation: `barGrow 1s ease-out ${
                    index * 0.2 + delay
                  }ms both`,
                  position: "relative",
                  overflow: "hidden",
                }}
                className="group"
              >
                <div style={dashboardStyles.progressShine}></div>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-30 h-3"
                  style={{
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px",
                  }}
                ></div>
              </div>
            </div>
            <div
              className="text-xs font-semibold text-white mt-2 transition-all duration-500"
              style={{
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCompressed, setSidebarCompressed] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleCompressed = () => {
    setSidebarCompressed(!isSidebarCompressed);
  };
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${base_url}api/dashboard/overview`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();

      if (result.status) {
        setDashboardData(result);
      } else {
        throw new Error(result.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Main Stats Data - Dynamic from API
  const mainStatsData = dashboardData
    ? [
        {
          title: "Total Donations",
          value: dashboardData.main_stats.total_donations,
          icon: faHandHoldingHeart,
          delay: 100,
        },
        {
          title: "Active Volunteers",
          value: dashboardData.main_stats.active_volunteers,
          icon: faUserFriends,
          delay: 200,
        },
        {
          title: "Upcoming Events",
          value: dashboardData.main_stats.upcoming_events,
          icon: faCalendarAlt,
          delay: 300,
        },
        {
          title: "Gallery Items",
          value: dashboardData.main_stats.gallery_items,
          icon: faImages,
          delay: 400,
        },
      ]
    : [];

  // Recent Events - Dynamic from API
  const recentEvents = dashboardData
    ? dashboardData.recent_events.map((event, index) => ({
        icon: faCalendarAlt,
        title: event.title,
        value: event.value,
        time: event.time,
        color: ["#667eea", "#764ba2", "#f47058"][index % 3], // Cycle through colors
      }))
    : [];

  // Recent Donations - Dynamic from API
  const recentDonations = dashboardData
    ? dashboardData.recent_donations.map((donation, index) => ({
        icon: faDonate,
        title: donation.title,
        value: donation.value,
        time: donation.time,
        color: ["#10b981", "#3b82f6", "#f59e0b"][index % 3], // Cycle through colors
      }))
    : [];

  // Recent Volunteers - Dynamic from API
  const recentVolunteers = dashboardData
    ? dashboardData.recent_volunteers.map((volunteer, index) => ({
        icon: faUserPlus,
        title: volunteer.title,
        value: volunteer.gender || "Volunteer", // Use gender or default value
        time: volunteer.time,
        color: ["#8b5cf6", "#ec4899", "#06b6d4"][index % 3], // Cycle through colors
      }))
    : [];

  // Graph Data
  // const donationData = [
  //   { label: "Jan", value: 12000 },
  //   { label: "Feb", value: 19000 },
  //   { label: "Mar", value: 15000 },
  //   { label: "Apr", value: 25000 },
  //   { label: "May", value: 22000 },
  //   { label: "Jun", value: 30000 },
  // ];

  // const volunteerData = [
  //   { label: "Jan", value: 45 },
  //   { label: "Feb", value: 52 },
  //   { label: "Mar", value: 48 },
  //   { label: "Apr", value: 65 },
  //   { label: "May", value: 70 },
  //   { label: "Jun", value: 85 },
  // ];

  if (isLoading) {
    return (
      <>
        <KeyframesStyles />
        <div style={dashboardStyles.container}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div
                className="text-5xl mb-4 animate-float"
                style={{ animation: "float 2s ease-in-out infinite" }}
              >
                💙
              </div>
              <h1 className="text-3xl font-bold text-[#2d365b] mb-3 animate-text-wave">
                Empathy Foundation
              </h1>
              <p className="text-lg text-[#7883ae]">
                Loading your dashboard...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <KeyframesStyles />
      <div style={dashboardStyles.container}>
        {/* NEW: Header Card with all-side curved rectangle and animations */}
        <div style={dashboardStyles.headerCard}>
          {/* Floating Orbs */}
          <div
            style={{
              ...dashboardStyles.floatingOrbs,
              ...dashboardStyles.floatingOrb1,
            }}
          ></div>
          <div
            style={{
              ...dashboardStyles.floatingOrbs,
              ...dashboardStyles.floatingOrb2,
            }}
          ></div>
          <div
            style={{
              ...dashboardStyles.floatingOrbs,
              ...dashboardStyles.floatingOrb3,
            }}
          ></div>
          <div
            style={{
              ...dashboardStyles.floatingOrbs,
              ...dashboardStyles.floatingOrb4,
            }}
          ></div>

          {/* Shimmer Effect */}
          <div style={dashboardStyles.shimmerEffect}></div>

          <div className="text-center text-white relative z-10">
            <h1
              className="text-4xl font-bold mb-4 animate-title-glow"
              style={{ animation: "slideInDown 0.8s ease-out" }}
            >
              Empathy Foundation
            </h1>
            <p
              className="text-lg opacity-90 max-w-2xl mx-auto animate-subtitle-pulse"
              style={{ animation: "slideInDown 0.8s ease-out 0.2s both" }}
            >
              Mental Health Awareness & Support - Making a Difference in Our
              Community
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Stats Grid - Separate section with proper spacing */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mainStatsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          </div>

          {/* Data and Graphs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Recent Events */}
            <div
              style={{
                ...dashboardStyles.dataCard,
                animation: "slideInFromLeft 0.8s ease-out 0.4s both",
              }}
            >
              <h3 className="text-lg font-semibold text-[#2d365b] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-2 text-[#667eea] animate-text-wave"
                />
                Recent Events
              </h3>
              <div className="space-y-3">
                {recentEvents.map((event, index) => (
                  <DataItem key={index} {...event} delay={index * 100} />
                ))}
              </div>
            </div>

            {/* Recent Donations */}
            <div
              style={{
                ...dashboardStyles.dataCard,
                animation: "fadeInUp 0.8s ease-out 0.5s both",
              }}
            >
              <h3 className="text-lg font-semibold text-[#2d365b] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faDonate}
                  className="mr-2 text-[#10b981] animate-text-wave"
                />
                Recent Donations
              </h3>
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <DataItem key={index} {...donation} delay={index * 100} />
                ))}
              </div>
            </div>

            {/* Recent Volunteers */}
            <div
              style={{
                ...dashboardStyles.dataCard,
                animation: "slideInFromRight 0.8s ease-out 0.6s both",
              }}
            >
              <h3 className="text-lg font-semibold text-[#2d365b] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="mr-2 text-[#8b5cf6] animate-text-wave"
                />
                Recent Volunteers
              </h3>
              <div className="space-y-3">
                {recentVolunteers.map((volunteer, index) => (
                  <DataItem key={index} {...volunteer} delay={index * 100} />
                ))}
              </div>
            </div>
          </div>

          {/* Graphs Section */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatedBarChart
              data={donationData}
              color="linear-gradient(180deg, #f47058 0%, #ff8a75 100%)"
              delay={200}
            />

            <AnimatedBarChart
              data={volunteerData}
              color="linear-gradient(180deg, #667eea 0%, #764ba2 100%)"
              delay={400}
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
