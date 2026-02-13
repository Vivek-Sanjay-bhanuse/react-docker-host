import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const CustomAlert = ({
  type = "info",
  message = "",
  onClose,
  onConfirm, // only for delete confirmation
  duration, // auto-close time (success/error)
}) => {
  const alertRef = useRef(null);

  // Default durations
  const autoCloseTime =
    type === "success" || type === "error" ? duration || 3000 : 0;

  // Auto close for success/error
  useEffect(() => {
    if (autoCloseTime > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoCloseTime, onClose]);

  // Close on outside click (only for delete modal)
  useEffect(() => {
    function handleClickOutside(e) {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        if (type === "delete") onClose && onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, type]);

  // Theme configuration
  const theme = {
    success: {
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: faCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
    },
    error: {
      bg: "bg-gradient-to-br from-red-50 to-orange-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: faExclamationCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
    },
    info: {
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: faInfoCircle,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    delete: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-800",
      icon: faTrash,
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
    },
  };

  const currentTheme = theme[type];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div
        ref={alertRef}
        className={`max-w-sm w-full rounded-xl shadow-xl border p-6 animate-scale-in ${currentTheme.bg} ${currentTheme.border}`}
      >
        {/* DELETE CONFIRMATION UI */}
        {type === "delete" ? (
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${currentTheme.iconBg} border-red-200`}>
                <FontAwesomeIcon 
                  icon={currentTheme.icon} 
                  className={`text-xl ${currentTheme.iconColor}`} 
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message || "Are you sure you want to delete this item? This action cannot be undone."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm && onConfirm();
                  onClose && onClose();
                }}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-all duration-300 border border-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          // SUCCESS / ERROR / INFO UI
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${currentTheme.iconBg} ${currentTheme.border}`}>
                <FontAwesomeIcon 
                  icon={currentTheme.icon} 
                  className={`text-lg ${currentTheme.iconColor}`} 
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <h3 className={`text-base font-bold ${currentTheme.text}`}>
                {type === "success" && "Success!"}
                {type === "error" && "Error!"}
                {type === "info" && "Information"}
              </h3>
              <p className={`text-sm font-medium ${currentTheme.text}`}>
                {message}
              </p>
            </div>

            {/* Progress bar for auto-close */}
            {autoCloseTime > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    type === "success" ? "bg-green-500" : 
                    type === "error" ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{
                    animation: `shrinkWidth ${autoCloseTime}ms linear forwards`
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CustomAlert;