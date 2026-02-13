import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../Admin/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSignOutAlt,
  faChevronDown,
  faBars,
  faUserShield,
  faCommentDots,
  faEnvelope,
  faCalendar,
  faDonate,
  faHandHoldingHeart,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import base_url from "../../Config";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, toggleCompressed, isCompressed }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "feedback":
        return faCommentDots; // add this icon ✔
      case "appointment":
        return faCalendarCheck; // add this icon ✔
      case "contact":
        return faEnvelope; // add this icon ✔
      case "event":
        return faCalendar;
      case "donation":
        return faDonate;
      case "volunteer":
        return faHandHoldingHeart;
      default:
        return faBell;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case "feedback":
        return "#667eea";
      case "appointment":
        return "#66e3eaff";
      case "contact":
        return "#3b82f6";
      case "event":
        return "#f47058";
      case "donation":
        return "#10b981";
      case "volunteer":
        return "#8b5cf6";
      default:
        return "#2d365b";
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base_url}api/notifications/latest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const result = await response.json();

      if (result.status && result.data) {
        // Transform API data to match frontend structure
        const transformedNotifications = result.data.map((item) => ({
          id: item.id,
          title: item.heading,
          message: item.message,
          time: item.time,
          unread: !item.is_read,
          icon: getNotificationIcon(item.type),
          color: getNotificationColor(item.type),
          type: item.type,
        }));

        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${base_url}api/notifications/read/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      const result = await response.json();

      if (result.status) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, unread: false }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);

    switch (notification.type) {
      case "event_reminder":
      case "event":
        navigate("/admin/events"); // Event page route
        break;

      case "volunteer":
        navigate("/admin/volunteers"); // Volunteer page route
        break;

      case "appointment":
        navigate("/admin/appointment"); // Volunteer page route
        break;
      case "contact":
      case "contact_us":
      case "feedback":
        navigate("/admin/user_management"); // Contact or Feedback management
        break;

      default:
        console.log("No route found");
    }

    setShowNotifications(false);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${base_url}api/notifications/read-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      const result = await response.json();

      if (result.status) {
        // Update local state - mark all as read
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, unread: false }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);

  // Refresh notifications when notification dropdown is opened
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm relative z-40">
      <div className="flex items-center justify-between">
        {/* Left side - Toggle buttons */}
        <div className="flex items-center space-x-4">
          {/* Mobile sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-3 rounded-lg text-gray-600 hover:text-[#2d365b] hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>

          {/* Desktop sidebar compress toggle */}
          <button
            onClick={toggleCompressed}
            className="hidden lg:flex p-3 rounded-lg text-gray-600 hover:text-[#2d365b] hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 items-center space-x-2"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-lg text-gray-600 hover:text-[#2d365b] hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 group"
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-2xl transition-all duration-300 group-hover:animate-bell-ring"
                />

                {/* Notification Count */}
                {unreadCount > 0 && (
                  <span className="absolute -top-4 -right-3 w-6 h-6 bg-[#2d365b] text-white text-xs rounded-full flex items-center justify-center border-2 border-white font-bold shadow-lg transform transition-all duration-300 group-hover:scale-110">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50 animate-slide-down">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

                {/* Notification Header */}
                <div className="px-6 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Notifications
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {unreadCount} unread{" "}
                        {unreadCount === 1 ? "message" : "messages"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#2d365b] hover:text-[#1e2a4b] font-semibold px-3 py-1 rounded-lg bg-[#2d365b]/10 hover:bg-[#2d365b]/20 transition-all duration-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="px-6 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d365b] mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <FontAwesomeIcon
                        icon={faBell}
                        className="text-4xl text-gray-300 mb-3"
                      />
                      <p className="text-sm text-gray-600">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleNotificationClick(notification)}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: `slideInRight 0.5s ease-out ${
                            index * 100
                          }ms both`,
                        }}
                      >
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                                notification.unread
                                  ? "bg-gradient-to-br from-[#2d365b] to-[#1e2a4b] text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 group-hover:bg-[#2d365b] group-hover:text-white"
                              }`}
                              style={{
                                background: notification.unread
                                  ? `linear-gradient(135deg, ${notification.color} 0%, #1e2a4b 100%)`
                                  : undefined,
                              }}
                            >
                              <FontAwesomeIcon
                                icon={notification.icon}
                                className="text-lg"
                              />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start ">
                              <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-[#2d365b] transition-colors">
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2 bg-gray-100 px-2 py-1 rounded-full">
                                  {notification.time}
                                </span>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-[#2d365b] rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="w-10 h-10 bg-[#2d365b] rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                <FontAwesomeIcon icon={faUserShield} className="text-lg" />
              </div>
              <p className="hidden md:block text-sm font-semibold text-gray-800 group-hover:text-[#2d365b]">
                Admin
              </p>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3 h-3 text-gray-500 transition-all duration-300 ${
                  showDropdown ? "rotate-180 text-[#2d365b]" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-slide-down">
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-[#2d365b] transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-[#2d365b] group-hover:text-white transition-all duration-300">
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-md" />
                  </div>
                  <span className="font-semibold text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showDropdown || showNotifications) && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => {
            setShowDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bell-ring {
          0% {
            transform: rotate(0);
          }
          10% {
            transform: rotate(15deg);
          }
          20% {
            transform: rotate(-15deg);
          }
          30% {
            transform: rotate(10deg);
          }
          40% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(5deg);
          }
          60% {
            transform: rotate(-5deg);
          }
          70% {
            transform: rotate(2deg);
          }
          80% {
            transform: rotate(-2deg);
          }
          90% {
            transform: rotate(1deg);
          }
          100% {
            transform: rotate(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-bell-ring {
          animation: bell-ring 0.5s ease-in-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "../Admin/Auth/AuthContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBell,
//   faSignOutAlt,
//   faChevronDown,
//   faBars,
//   faUserShield,
// } from "@fortawesome/free-solid-svg-icons";
// import { NOTIFICATIONS } from "./Utils/constants";

// const Navbar = ({ toggleSidebar }) => {
//   const { user, logout } = useAuth();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [currentDate, setCurrentDate] = useState("");
//   const dropdownRef = useRef(null);
//   const notificationRef = useRef(null);

//   const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

//   // Set current date
//   useEffect(() => {
//     const updateDate = () => {
//       const now = new Date();
//       const options = {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       };
//       setCurrentDate(now.toLocaleDateString('en-US', options));
//     };

//     updateDate();
//     const interval = setInterval(updateDate, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target)
//       ) {
//         setShowNotifications(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const markAsRead = (id) => {
//     console.log("Marking notification as read:", id);
//   };

//   const markAllAsRead = () => {
//     console.log("Marking all notifications as read");
//   };

//   return (
//     <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm relative z-40">
//       <div className="flex items-center justify-between">
//         {/* Left side - Menu toggle & Date */}
//         <div className="flex items-center space-x-6">
//           <button
//             onClick={toggleSidebar}
//             className="lg:hidden p-3 rounded-lg text-gray-600 hover:text-[#2d365b] hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
//           >
//             <FontAwesomeIcon icon={faBars} className="text-lg" />
//           </button>

//           {/* Date Display */}
//           <div className="flex flex-col">
//             <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Today is
//             </div>
//             <div className="text-lg font-semibold text-gray-800">
//               {currentDate}
//             </div>
//           </div>
//         </div>

//         {/* Right side - Notifications & Admin */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           <div className="relative" ref={notificationRef}>
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-3 rounded-lg text-gray-600 hover:text-[#2d365b] hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 group"
//             >
//               <div className="relative">
//                 <FontAwesomeIcon
//                   icon={faBell}
//                   className="text-2xl transition-all duration-300 group-hover:animate-bell-ring"
//                 />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2d365b] text-white text-xs rounded-full flex items-center justify-center border border-white font-bold transform transition-all duration-300 group-hover:scale-110">
//                     {unreadCount}
//                   </span>
//                 )}
//               </div>
//             </button>

//             {/* Enhanced Notification Dropdown */}
//             {showNotifications && (
//               <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50 animate-slide-down">
//                 {/* Arrow indicator */}
//                 <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

//                 {/* Header */}
//                 <div className="px-6 pb-4 border-b border-gray-100">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">
//                         Notifications
//                       </h3>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {unreadCount} unread messages
//                       </p>
//                     </div>
//                     {unreadCount > 0 && (
//                       <button
//                         onClick={markAllAsRead}
//                         className="text-sm text-white bg-[#2d365b] hover:bg-[#1e2a4b] font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
//                       >
//                         Mark all read
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Notifications List */}
//                 <div className="max-h-96 overflow-y-auto custom-scrollbar">
//                   {NOTIFICATIONS.map((notification, index) => (
//                     <div
//                       key={notification.id}
//                       className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer group"
//                       onClick={() => markAsRead(notification.id)}
//                       style={{
//                         animationDelay: `${index * 100}ms`,
//                         animation: `slideInRight 0.5s ease-out ${index * 100}ms both`
//                       }}
//                     >
//                       <div className="flex space-x-4">
//                         {/* Large Notification Icon */}
//                         <div className="flex-shrink-0">
//                           <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
//                             notification.unread
//                               ? "bg-gradient-to-br from-[#2d365b] to-[#1e2a4b] text-white shadow-md"
//                               : "bg-gray-100 text-gray-600 group-hover:bg-[#2d365b] group-hover:text-white"
//                           }`}>
//                             <FontAwesomeIcon
//                               icon={notification.icon}
//                               className="text-xl"
//                             />
//                           </div>
//                         </div>

//                         {/* Notification Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <h4 className="font-bold text-gray-800 text-base leading-tight group-hover:text-[#2d365b] transition-colors">
//                               {notification.title}
//                             </h4>
//                             <div className="flex items-center space-x-2">
//                               <span className="text-xs text-gray-500 whitespace-nowrap ml-2 bg-gray-100 px-2 py-1 rounded-full">
//                                 {notification.time}
//                               </span>
//                               {notification.unread && (
//                                 <div className="w-2 h-2 bg-[#2d365b] rounded-full animate-pulse"></div>
//                               )}
//                             </div>
//                           </div>
//                           <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
//                             {notification.message}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Admin dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 group"
//             >
//               <div className="w-10 h-10 bg-[#2d365b] rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
//                 <FontAwesomeIcon icon={faUserShield} className="text-lg" />
//               </div>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2d365b] transition-colors">
//                   Admin
//                 </p>
//               </div>
//               <FontAwesomeIcon
//                 icon={faChevronDown}
//                 className={`w-3 h-3 text-gray-500 transition-all duration-300 transform ${
//                   showDropdown ? "rotate-180 text-[#2d365b]" : "group-hover:text-[#2d365b]"
//                 }`}
//               />
//             </button>

//             {/* Enhanced Dropdown menu - Only Logout */}
//             {showDropdown && (
//               <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-slide-down">
//                 {/* Arrow indicator */}
//                 <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

//                 <button
//                   onClick={logout}
//                   className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-[#2d365b] transition-all duration-300 group transform hover:translate-x-1"
//                 >
//                   <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-[#2d365b] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
//                     <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
//                   </div>
//                   <span className="font-semibold text-sm">Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Background overlay for dropdowns */}
//       {(showDropdown || showNotifications) && (
//         <div
//           className="fixed inset-0 z-30 bg-transparent"
//           onClick={() => {
//             setShowDropdown(false);
//             setShowNotifications(false);
//           }}
//         />
//       )}

//       {/* Custom CSS for animations */}
//       <style jsx>{`
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-10px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         @keyframes slide-in-right {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes bell-ring {
//           0% { transform: rotate(0); }
//           10% { transform: rotate(15deg); }
//           20% { transform: rotate(-15deg); }
//           30% { transform: rotate(10deg); }
//           40% { transform: rotate(-10deg); }
//           50% { transform: rotate(5deg); }
//           60% { transform: rotate(-5deg); }
//           70% { transform: rotate(2deg); }
//           80% { transform: rotate(-2deg); }
//           90% { transform: rotate(1deg); }
//           100% { transform: rotate(0); }
//         }

//         .animate-slide-down {
//           animation: slide-down 0.3s ease-out;
//         }

//         .animate-bell-ring {
//           animation: bell-ring 0.5s ease-in-out;
//         }

//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #d1d1d1;
//           border-radius: 10px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #a8a8a8;
//         }
//       `}</style>
//     </nav>
//   );
// };

// export default Navbar;
