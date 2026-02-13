import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSearch,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faPhone,
  faEnvelope,
  faCalendar,
  faUser,
  faStar,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import base_url from "../../../Config";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const volunteersPerPage = 6;
  const filterRef = useRef(null);

  // API endpoints
  const API_BASE = `${base_url}api/volunteer`;

  // Fetch all volunteers
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/get`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setVolunteers(result.data);
      } else {
        setVolunteers([]);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch volunteers",
      });
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete volunteer
  const deleteVolunteer = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.status) {
        await fetchVolunteers(); // Refresh the volunteers list
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete volunteer');
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Click outside to close filter modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    };

    if (showFilterModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterModal]);

  // Filter volunteers based on search and availability
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.mobile.includes(searchQuery) ||
      volunteer.skills.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability =
      availabilityFilter.length === 0 ||
      availabilityFilter.includes(volunteer.availability);

    return matchesSearch && matchesAvailability;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVolunteers.length / volunteersPerPage);
  const indexOfLastVolunteer = currentPage * volunteersPerPage;
  const indexOfFirstVolunteer = indexOfLastVolunteer - volunteersPerPage;
  const currentVolunteers = filteredVolunteers.slice(
    indexOfFirstVolunteer,
    indexOfLastVolunteer
  );

  const handleDelete = async (id) => {
    try {
      await deleteVolunteer(id);
      setAlert({
        type: "success",
        message: "Volunteer deleted successfully!",
      });
      setDeleteConfirm(null);
      setDetailModal(null);

      // Adjust current page if needed after deletion
      if (currentVolunteers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to delete volunteer",
      });
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setAvailabilityFilter([]);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  // Format image URL - add base URL if it's a relative path
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face";
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${base_url}public/${imagePath}`;
    }
  };

  // Parse skills string to array
  const parseSkills = (skillsString) => {
    if (!skillsString) return [];
    if (Array.isArray(skillsString)) return skillsString;
    
    // Handle comma-separated skills string
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  // Dynamic pagination generation
  const getPaginationNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push("...");
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  // Format skills to show in one line with ellipsis
  const formatSkills = (skills) => {
    const skillsArray = parseSkills(skills);
    const skillsString = skillsArray.join(", ");
    return skillsString.length > 40
      ? skillsString.substring(0, 40) + "..."
      : skillsString;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d365b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-[#2d365b] mb-2">
              Volunteers Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage foundation volunteers and their information
            </p>
          </div>
        </div>

        {/* Compact Search and Filter Bar */}
        <div className="p-2">
          <div className="flex items-center justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-400 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="bg-[#2d365b] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1e2a4a] transition-all duration-300 flex items-center space-x-2 border border-[#2d365b] text-sm whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faFilter} className="text-xs" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Volunteers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentVolunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden group hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-500 ease-in-out cursor-pointer"
              onClick={() => setDetailModal(volunteer)}
            >
              {/* Image and Basic Info */}
              <div className="h-40 overflow-hidden relative">
                <img
                  src={formatImageUrl(volunteer.image)}
                  alt={volunteer.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>

              {/* Volunteer Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-[#2d365b] mb-1">
                  {volunteer.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{volunteer.email}</p>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faUser} className="text-[#2d365b]" />
                    <span>Age: {volunteer.age}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="text-[#2d365b]"
                    />
                    <span>{volunteer.gender}</span>
                  </div>
                </div>

                {/* Skills - Single line with ellipsis */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    Skills:
                  </div>
                  <div
                    className="text-xs text-gray-600 truncate"
                    title={volunteer.skills}
                  >
                    {formatSkills(volunteer.skills)}
                  </div>
                </div>

                {/* Delete Button */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(volunteer.id);
                    }}
                    className="w-full bg-white text-red-600 py-1.5 rounded-md font-semibold hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-1 border border-red-300 text-xs"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVolunteers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">🤝</div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No Volunteers Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              No volunteer records match your search criteria. Try adjusting
              your filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#2d365b] transition-all duration-300"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-[#2d365b] text-sm"
              />
            </button>

            {/* Page Numbers */}
            {getPaginationNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNum === "number" && setCurrentPage(pageNum)
                }
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-300 text-sm ${
                  pageNum === currentPage
                    ? "bg-[#2d365b] text-white shadow-md border border-[#2d365b]"
                    : "bg-white text-gray-700 shadow-md border border-gray-300 hover:border-[#2d365b] hover:bg-gray-50"
                } ${
                  pageNum === "..."
                    ? "cursor-default hover:bg-white hover:border-gray-300"
                    : ""
                }`}
                disabled={pageNum === "..."}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#2d365b] transition-all duration-300"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-[#2d365b] text-sm"
              />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <CustomAlert
          type="delete"
          message="Are you sure you want to delete this volunteer? This action cannot be undone."
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            ref={filterRef}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md animate-scale-in p-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <h3 className="text-base font-bold text-[#2d365b]">
                Filter Volunteers
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </button>
            </div>

            {/* Search in Filter Modal */}
            <div className="space-y-4">
              

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  {[
                    { value: "All", label: "All Availability" },
                    { value: "Weekends", label: "Weekends" },
                    { value: "Weekdays", label: "Weekdays" },
                    { value: "Flexible", label: "Flexible" },
                    { value: "Evenings", label: "Evenings" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group text-sm"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={availabilityFilter.includes(option.value)}
                          onChange={(e) => {
                            if (option.value === "All") {
                              setAvailabilityFilter(["All"]);
                            } else {
                              const newFilters = e.target.checked
                                ? [
                                    ...availabilityFilter.filter(
                                      (item) => item !== "All"
                                    ),
                                    option.value,
                                  ]
                                : availabilityFilter.filter(
                                    (item) => item !== option.value
                                  );
                              setAvailabilityFilter(
                                newFilters.length > 0 ? newFilters : ["All"]
                              );
                            }
                          }}
                          className="w-3 h-3 text-[#2d365b] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#2d365b] focus:ring-offset-2 transition-all duration-200 group-hover:border-[#2d365b]"
                        />
                        <div
                          className={`absolute inset-0 rounded border-2 transition-all duration-200 ${
                            availabilityFilter.includes(option.value)
                              ? "border-[#2d365b] bg-[#2d365b]"
                              : "border-transparent"
                          }`}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 mt-3 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition-all duration-300 text-sm"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 bg-[#2d365b] text-white py-2 rounded-md font-semibold hover:bg-[#1e2a4a] transition-all duration-300 text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Detail Modal */}
      {detailModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl animate-scale-in overflow-hidden"
            style={{ maxHeight: "90vh", height: "500px" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-[#2d365b] to-[#3a4a7a] text-white p-3 rounded-lg m-2 mt-3">
              <div>
                <h2 className="text-lg font-bold">{detailModal.name}</h2>
                <p className="text-blue-100 text-xs">Volunteer Details</p>
              </div>
            </div>

            {/* Modal Content */}
            <div
              className="p-4 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 80px)" }}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Column - Image and Basic Info */}
                <div className="lg:w-1/3">
                  <img
                    src={formatImageUrl(detailModal.image)}
                    alt={detailModal.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Age:</span>
                      <span>{detailModal.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        Gender:
                      </span>
                      <span>{detailModal.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        Experience:
                      </span>
                      <span>{detailModal.experience || "NA"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        Availability:
                      </span>
                      <span>{detailModal.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        Join Date:
                      </span>
                      <span>
                        {new Date(detailModal.join_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact and Skills */}
                <div className="lg:w-2/3">
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-base font-semibold text-[#2d365b] mb-2">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md text-sm">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="text-[#2d365b] text-xs"
                          />
                          <div>
                            <div className="font-bold text-gray-700">
                              Email : {detailModal.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md text-sm">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="text-[#2d365b] text-xs"
                          />
                          <div>
                            <div className="font-bold text-gray-700">
                              Mobile : {detailModal.mobile}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-base font-semibold text-[#2d365b] mb-2">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {parseSkills(detailModal.skills).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#2d365b] text-white rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Button at Bottom */}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setDetailModal(null);
                  setDeleteConfirm(detailModal.id);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-1 text-sm"
              >
                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                <span>Delete Volunteer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;