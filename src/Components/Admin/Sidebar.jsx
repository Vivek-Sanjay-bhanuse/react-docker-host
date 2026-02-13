// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { SIDEBAR_MENU } from "./Utils/constants";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTimes,
//   faChevronDown,
//   faChevronRight,
// } from "@fortawesome/free-solid-svg-icons";
// import logo from "../../assets/images/logo.png";

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [openMenus, setOpenMenus] = useState({});
//   const location = useLocation();
//   const navigate = useNavigate();

//   const toggleMenu = (title) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   const isActiveLink = (path) => location.pathname === path;

//   const handleItemClick = (item) => {
//     if (item.path) {
//       navigate(item.path);
//       if (window.innerWidth < 1024) toggleSidebar();
//     } else if (item.children?.length > 0) {
//       toggleMenu(item.title);
//     }
//   };

//   const renderMenuItem = (item, depth = 0) => {
//     const hasChildren = item.children?.length > 0;
//     const isOpen = openMenus[item.title];
//     const isActive = isActiveLink(item.path);

//     return (
//       <div key={item.title} className="mb-1">
//         <div
//           onClick={() => handleItemClick(item)}
//           className={`
//             relative flex items-center px-3 py-3 rounded-lg
//             transition-all duration-300 cursor-pointer border-2

//             ${hasChildren ? "justify-between" : ""}
//             ${
//               isActive
//                 ? "bg-gradient-to-r from-[#2d365b] to-[#1e2a4b] text-white shadow-lg border-[#f47058]"
//                 : "text-[#2d365b] bg-white hover:bg-[#f8fafc] border-gray-300 hover:border-[#7883ae]"
//             }
//           `}
//           style={{
//             paddingLeft: `${depth * 20 + 16}px`,
//             borderLeft: isActive
//               ? "4px solid #f47058"
//               : "2px solid #d1d5db",
//           }}
//         >
//           {/* Active indicator */}
//           {isActive && (
//             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#f47058] rounded-r-full"></div>
//           )}

//           <div className="flex items-center space-x-3 flex-1">
//             <div
//               className={`
//                 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border
//                 ${
//                   isActive
//                     ? "bg-white text-[#2d365b] shadow-md border-[#f47058]"
//                     : "bg-white text-[#2d365b] border-[#2d365b]/30 hover:border-[#2d365b]"
//                 }
//               `}
//             >
//               <FontAwesomeIcon
//                 icon={item.icon}
//                 className={`text-base ${isActive ? "font-bold" : "font-medium"}`}
//               />
//             </div>

//             <span
//               className={`font-semibold text-sm tracking-wide transition-all duration-300
//               ${isActive ? "text-white scale-105" : "text-[#2d365b]"}`}
//             >
//               {item.title}
//             </span>
//           </div>

//           {hasChildren && (
//             <FontAwesomeIcon
//               icon={isOpen ? faChevronDown : faChevronRight}
//               className={`text-xs transition-transform duration-300 ml-2 ${
//                 isActive ? "text-white" : "text-[#7883ae]"
//               }`}
//             />
//           )}
//         </div>

//         {/* Submenu */}
//         {hasChildren && isOpen && (
//           <div
//             className="mt-1 ml-5 border-l-2 border-[#e2e8f0] pl-3 animate-fade-in"
//             style={{ marginLeft: `${depth * 20 + 20}px` }}
//           >
//             {item.children.map((child) => renderMenuItem(child, depth + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-transparent z-40 lg:hidden"
//           onClick={toggleSidebar}
//         />
//       )}

//       <div
//         className={`
//           fixed lg:static inset-y-0 left-0 z-50
//           w-72 bg-white shadow-2xl lg:shadow-lg
//           transform transition-all duration-300 ease-in-out
//           ${
//             isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//           }
//           border-r-2 border-gray-300
//           flex flex-col
//           overflow-hidden
//         `}
//       >
//         {/* Logo */}
//         <div className="p-5 border-b-2 border-gray-300 bg-white">
//           <div className="flex items-center justify-between">
//             <div className="w-61 h-16 rounded-xl shadow-lg border-2 border-[#7883ae] overflow-hidden">
//               <img src={logo} alt="Logo" className="w-full h-full object-cover" />
//             </div>

//             <button
//               onClick={toggleSidebar}
//               className="lg:hidden p-2 text-[#7883ae] hover:text-[#2d365b] hover:bg-gray-100 rounded-xl transition-all duration-300 border hover:border-[#7883ae]"
//             >
//               <FontAwesomeIcon icon={faTimes} className="text-lg" />
//             </button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-5 overflow-y-auto no-scrollbar">
//           <div className="space-y-2">
//             {SIDEBAR_MENU.map((item) => renderMenuItem(item))}
//           </div>
//         </nav>
//       </div>

//       <style jsx>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }

//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SIDEBAR_MENU } from "./Utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";

const Sidebar = ({ isOpen, toggleSidebar, isCompressed, toggleCompressed }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActiveLink = (path) => location.pathname === path;

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
      if (window.innerWidth < 1024) toggleSidebar();
    } else if (item.children?.length > 0) {
      toggleMenu(item.title);
    }
  };

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children?.length > 0;
    const isOpen = openMenus[item.title];
    const isActive = isActiveLink(item.path);

    return (
      <div key={item.title} className="mb-1 relative">
        <div
          onClick={() => handleItemClick(item)}
          className={`
            relative flex items-center py-3 rounded-xl
            transition-all duration-300 ease-out-cubic cursor-pointer
            group transform-gpu mx-2
            ${hasChildren ? "justify-between" : ""}
            ${
              isActive
                ? "bg-gradient-to-r from-[#2d365b] to-[#1e2a4b] text-white shadow-lg"
                : "text-[#2d365b] bg-white hover:bg-[#f8fafc]"
            }
          `}
          style={{
            paddingLeft: `${depth * 16 + (isCompressed ? 10 : 14)}px`,
            paddingRight: `${isCompressed ? 10 : 14}px`,
            marginLeft: `${depth * 8}px`,
            marginRight: `${isCompressed ? 6 : 8}px`,
          }}
        >

          {/* Active Indicator */}
          {isActive && (
            <div
              className={`absolute top-1/2 -translate-y-1/2  bg-[#f47058] rounded-r-full transition-all duration-500 ease-out ${
                 isCompressed
        ? "left-[2px] w-[3px] h-10"   // thinner orange strip when sidebar is compressed
        : "left-0 w-[6px] h-12" 
              }`}
            />
          )}

          {/* Main Row */}
          <div className="flex items-center space-x-3 flex-1">
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-300 ease-out-cubic
                group-hover:scale-110 group-hover:shadow-md
                ${isActive ? "bg-white text-[#2d365b] shadow-md" : "bg-white text-[#2d365b]"}
              `}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-base transition-transform duration-300 ease-out ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              />
            </div>

            {!isCompressed && (
              <span
                className={`font-semibold text-sm tracking-wide transition-all duration-300 ease-out-cubic ${
                  isActive ? "text-white scale-105" : "text-[#2d365b] group-hover:translate-x-1"
                }`}
              >
                {item.title}
              </span>
            )}
          </div>

          {!isCompressed && hasChildren && (
            <FontAwesomeIcon
              icon={isOpen ? faChevronDown : faChevronRight}
              className={`text-xs transition-all duration-300 ease-out-cubic ml-2 ${
                isActive ? "text-white" : "text-[#7883ae] group-hover:text-[#2d365b]"
              } ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>

        {/* ⭐ CENTER STRONG + LIGHT ENDS BOTTOM BORDER ⭐ */}
        <div
          className="absolute left-2 right-2 bottom-0 h-[2px]"
          style={{
            background:
              "linear-gradient(to right, rgba(120,131,174,0.2), rgba(120,131,174,0.8), rgba(120,131,174,0.2))",
          }}
        />

        {/* Submenu */}
        {!isCompressed && hasChildren && isOpen && (
          <div
            className="mt-1 ml-5 border-l-2 border-[#e2e8f0] pl-3 animate-fade-in"
            style={{ marginLeft: `${depth * 16 + 16}px` }}
          >
            {item.children.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isCompressed ? "w-24" : "w-72"}
          bg-white shadow-2xl lg:shadow-xl
          transform transition-all duration-500 ease-out-expo
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col overflow-hidden border-r-2 border-gray-300
        `}
      >
        {/* Logo Area */}
        <div className="p-4 border-b-2 border-gray-300 bg-white pb-6">
          <div className="flex items-center justify-between">
            <div
              className={`transition-all duration-300 ease-out-expo ${
                isCompressed ? "w-12 h-12" : "w-48 h-12"
              }`}
            >
              {isCompressed ? (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d365b] to-[#1e2a4b] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  EF
                </div>
              ) : (
                <img src={logo} alt="Logo" className="w-full h-full pl-5 object-contain" />
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-[#7883ae] rounded-lg hover:bg-gray-100 hover:text-[#2d365b] hover:scale-110 transition"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Menu List */}
        <nav className="flex-1 p-3 overflow-y-auto no-scrollbar">
          <div className="space-y-2">{SIDEBAR_MENU.map((item) => renderMenuItem(item))}</div>
        </nav>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
