import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (session-based)
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userData = sessionStorage.getItem("user");

    if (isLoggedIn === "true" && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API call - No token storage
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo credentials - replace with your actual authentication logic
        if (
          (username === "admin" || username === "admin@empathyfoundation.org") &&
          password === "password"
        ) {
          const userData = {
            id: 1,
            name: "Admin User",
            username: username,
            role: "admin",
            avatar: "👨‍💼",
          };

          setUser(userData);
          // Store only in sessionStorage (cleared when browser closes)
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("user", JSON.stringify(userData));
          resolve({ success: true });
        } else {
          resolve({ 
            success: false, 
            error: "Invalid username or password. Please try again." 
          });
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    // Clear session storage on logout
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



// import React, { useState } from "react";
// import { useAuth } from "./AuthContext";
// import { useNavigate, useLocation } from "react-router-dom";
// import CustomAlert from "../../CustomAlert/CustomAlert";
// import EMImage from "../../../assets/images/empathy_image_old-removebg-preview.png";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const from = location.state?.from?.pathname || "/admin";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const result = await login(email, password);

//       if (result.success) {
//         setAlert({
//           type: "success",
//           message: "Login successful! Redirecting...",
//         });
//         setTimeout(() => navigate(from, { replace: true }), 1000);
//       } else {
//         setAlert({
//           type: "error",
//           message: result.error || "Login failed!",
//         });
//       }
//     } catch (error) {
//       setAlert({
//         type: "error",
//         message: "An error occurred during login.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="
//         min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden
//         bg-gradient-to-b from-[#2d365be6] via-[#2d365bb3] to-[#f4705899]
//       "
//       style={{
//         backgroundImage: `
//           linear-gradient(
//             to bottom,
//             rgba(45,54,91,0.95) 0%,
//             rgba(45,54,91,0.85) 60%,
//             rgba(244,112,88,0.80) 100%
//           ),
//           url(${EMImage})
//         `,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Dark overlay to increase opacity */}
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

//       {/* Alerts */}
//       {alert && (
//         <CustomAlert
//           type={alert.type}
//           message={alert.message}
//           onClose={() => setAlert(null)}
//         />
//       )}

//       {/* Login Card with Torch Effect */}
//       <div
//         className="
//           w-full max-w-sm rounded-xl px-6 py-8 sm:px-8 relative z-10 shadow-2xl
//           border border-white/20 animate-fadeIn
//         "
//         style={{
//           background:
//             "radial-gradient(circle at top, rgba(255,255,255,0.45), rgba(0,0,0,0.9))",
//           boxShadow: "0 0 35px rgba(255,255,255,0.2)",
//         }}
//       >
//         {/* Title */}
//         <div className="text-center mb-8 drop-shadow-lg">
//           <h2 className="text-3xl font-extrabold text-white tracking-wide">
//             Admin Login
//           </h2>
//         </div>

//         {/* Form */}
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           {/* Email */}
//           <div className="flex flex-col">
//             <label className="text-white mb-1 text-sm font-semibold">
//               Username
//             </label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="
//                 px-4 py-3 bg-white/20 text-white border border-white/40 rounded-lg 
//                 placeholder-white/70 focus:ring-2 focus:ring-white/90 
//                 focus:outline-none transition 
//               "
//               placeholder="Enter your username"
//               disabled={loading}
//             />
//           </div>

//           {/* Password */}
//           <div className="flex flex-col">
//             <label className="text-white mb-1 text-sm font-semibold">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="
//                 px-4 py-3 bg-white/20 text-white border border-white/40 rounded-lg 
//                 placeholder-white/70 focus:ring-2 focus:ring-white/90 
//                 focus:outline-none transition
//               "
//               placeholder="Enter your password"
//               disabled={loading}
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="
//               w-full py-3 bg-white/30 text-white rounded-lg font-semibold 
//               border border-white/50 shadow-lg 
//               hover:bg-white/50 hover:border-white/80 
//               transition-all duration-300 
//               disabled:opacity-50 disabled:cursor-not-allowed
//             "
//           >
//             {loading ? (
//               <div className="flex items-center justify-center space-x-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span>Signing In...</span>
//               </div>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Floating Blobs */}
//       <div className="absolute top-10 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//       <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//     </div>
//   );
// };

// export default Login;
