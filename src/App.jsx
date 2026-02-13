import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import "./App.css";

/* ======================
   Website Pages
====================== */
import HomePage from "./pages/HomePage/HomePage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import OurInitiativesPage from "./pages/OurInitiativesPage/OurInitiativesPage";
import EventsActivitiesPage from "./pages/EventsActivitiesPage/EventsActivitiesPage";
import PartnerHospitalsPage from "./pages/PartnerHospitalsPage/PartnerHospitalsPage";
import BlogNewsPage from "./pages/BlogNewsPage/BlogNewsPage";
import GalleryPage from "./pages/GalleryPage/GalleryPage";
import DonatePage from "./pages/DonatePage/DonatePage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AppointmentPage from "./pages/AppointmentPage/AppointmentPage";
import ScrollToTop from "./Components/User/CommonComponents/ScrollToTop";
import BackHistoryButton from "./Components/User/CommonComponents/BackHistoryButton";


/* ======================
   Admin Components
====================== */
import { AuthProvider, useAuth } from "./Components/Admin/Auth/AuthContext";
import Sidebar from "./Components/Admin/Sidebar";
import Navbar from "./Components/Admin/Navbar";
import Dashboard from "./Components/Admin/Dashboard";
import Login from "./Components/Admin/Auth/Login";
import Events from "./Components/Admin/Pages/Events";
import Initiatives from "./Components/Admin/Pages/Initiatives";
import Blogs from "./Components/Admin/Pages/Blogs";
import Gallery from "./Components/Admin/Pages/Gallery";
import Hospitals from "./Components/Admin/Pages/Hospitals";
import Team from "./Components/Admin/Pages/Team";
import Donations from "./Components/Admin/Pages/Donations";
import Volunteers from "./Components/Admin/Pages/Volunteers";
import Appointment from "./Components/Admin/Pages/Appointments";
/* ======================
   Protected Route
====================== */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

/* ======================
   Admin Layout
====================== */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCompressed, setSidebarCompressed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isCompressed={sidebarCompressed}
        toggleCompressed={() => setSidebarCompressed(!sidebarCompressed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          toggleCompressed={() => setSidebarCompressed(!sidebarCompressed)}
          isCompressed={sidebarCompressed}
        />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/initiatives" element={<Initiatives />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/user_management" element={<Hospitals />} />
            <Route path="/team" element={<Team />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/volunteers" element={<Volunteers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

/* ======================
   MAIN APP
====================== */
export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <BackHistoryButton />
      <Routes>
        {/* Website */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/initiatives" element={<OurInitiativesPage />} />
        <Route path="/events" element={<EventsActivitiesPage />} />
        <Route path="/partner-hospitals" element={<PartnerHospitalsPage />} />
        <Route path="/blog" element={<BlogNewsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />

        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
