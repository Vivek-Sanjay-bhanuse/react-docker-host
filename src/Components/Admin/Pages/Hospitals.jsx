import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faEnvelope,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import base_url from "../../../Config";

const Hospitals = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which item is being updated
  const recordsPerPage = 10;
  const filterRef = useRef(null);

  // API endpoints
  const FEEDBACK_API_BASE = `${base_url}api/feedback`;
  const CONTACT_API_BASE = `${base_url}api/contact`;

  // Feedback Data
  const [feedbacks, setFeedbacks] = useState([]);

  // Contact Us Data
  const [contacts, setContacts] = useState([]);

  // Fetch feedback data
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${FEEDBACK_API_BASE}/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      
      if (result.status && result.data) {
        // Map API data to match frontend format
        const formattedFeedbacks = result.data.map(item => ({
          id: item.id,
          name: item.name,
          designation: item.designation,
          feedback: item.feedback,
          status: item.status ? "active" : "inactive",
          date: item.created_at,
          showTestimonial: item.status === 1
        }));
        setFeedbacks(formattedFeedbacks);
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch feedbacks",
      });
      setFeedbacks([]);
    }
  };

  // Fetch contact data
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${CONTACT_API_BASE}/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      
      if (result.status && result.data) {
        // Map API data to match frontend format
        const formattedContacts = result.data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          message: item.message,
          status: item.status,
          date: item.created_at,
        }));
        setContacts(formattedContacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch contacts",
      });
      setContacts([]);
    }
  };

  // Initial data fetch
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch both data in parallel
      await Promise.all([fetchFeedbacks(), fetchContacts()]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(`${FEEDBACK_API_BASE}/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.status) {
        await fetchFeedbacks(); // Refresh the feedback list
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete feedback');
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${CONTACT_API_BASE}/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.status) {
        await fetchContacts(); // Refresh the contact list
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  };

  // Update feedback status - OPTIMIZED VERSION
  const updateFeedbackStatus = async (id, status) => {
    try {
      setUpdatingStatus(id);
      
      const response = await fetch(`${FEEDBACK_API_BASE}/status/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status
        }),
      });

      const result = await response.json();

      if (result.status) {
        // Update local state immediately without refetching all data
        setFeedbacks(prev => prev.map(feedback => 
          feedback.id === id 
            ? { 
                ...feedback, 
                status: status ? "active" : "inactive",
                showTestimonial: status
              }
            : feedback
        ));
        return true;
      } else {
        throw new Error(result.message || 'Failed to update feedback status');
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
      throw error;
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Update contact status - OPTIMIZED VERSION
  const updateContactStatus = async (id, status) => {
    try {
      setUpdatingStatus(id);
      
      const response = await fetch(`${CONTACT_API_BASE}/status/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status
        }),
      });

      const result = await response.json();

      if (result.status) {
        // Update local state immediately without refetching all data
        setContacts(prev => prev.map(contact => 
          contact.id === id 
            ? { ...contact, status: status }
            : contact
        ));
        return true;
      } else {
        throw new Error(result.message || 'Failed to update contact status');
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      throw error;
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "feedback") {
      fetchFeedbacks();
    } else {
      fetchContacts();
    }
  }, [activeTab]);

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

  // Filter data based on active tab and search
  const getFilteredData = () => {
    const data = activeTab === "feedback" ? feedbacks : contacts;
    
    return data.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.designation && item.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.feedback && item.feedback.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredData = getFilteredData();

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Toggle testimonial visibility
  const toggleTestimonial = async (id) => {
    try {
      const feedback = feedbacks.find(f => f.id === id);
      const newStatus = !feedback.showTestimonial;
      
      await updateFeedbackStatus(id, newStatus);
      
      setAlert({
        type: "success",
        message: `Testimonial ${newStatus ? "shown on" : "hidden from"} website`,
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to update testimonial status",
      });
    }
  };

  // Handle reply click
  const handleReply = (email) => {
    const senderEmail = "abc@gmail.com";
    const subject = "Re: Your Inquiry - Mind Care Foundation";
    const body = "Dear valued contact,\n\nThank you for reaching out to us. We appreciate your interest in our services.\n\nBest regards,\nMind Care Foundation Team";
    
    const mailtoLink = `mailto:${email}?from=${encodeURIComponent(senderEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
  };

  // Mark contact as replied
  const markAsReplied = async (id) => {
    try {
      await updateContactStatus(id, "replied");
      
      setAlert({
        type: "success",
        message: "Contact marked as replied",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to update contact status",
      });
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
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

  // Get status options based on active tab
  const getStatusOptions = () => {
    if (activeTab === "feedback") {
      return ["All", "active", "inactive"];
    } else {
      return ["All", "pending", "replied"];
    }
  };

  // Count pending contacts for highlight
  const pendingContactsCount = contacts.filter(contact => contact.status === "pending").length;
  const inactiveFeedbacksCount = feedbacks.filter(feedback => feedback.status === "inactive").length;

  // Function to truncate text to 200 characters
  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d365b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
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
              User Submissions
            </h1>
            <p className="text-gray-600 text-base">
              Manage feedback and contact us submissions
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-1">
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setActiveTab("feedback");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "feedback"
                    ? "bg-[#2d365b] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm">Feedback</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === "feedback"
                      ? "bg-white text-[#2d365b]"
                      : inactiveFeedbacksCount > 0 
                        ? "bg-[#2d365b] text-white font-bold"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {inactiveFeedbacksCount > 0 ? inactiveFeedbacksCount : feedbacks.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("contact");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "contact"
                    ? "bg-[#2d365b] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm">Contact Us</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === "contact"
                      ? "bg-white text-[#2d365b]"
                      : pendingContactsCount > 0 
                        ? "bg-[#2d365b] text-white  font-bold"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {pendingContactsCount > 0 ? pendingContactsCount : contacts.length}
                </span>
              </button>
            </div>
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
                  placeholder={`Search ${activeTab === "feedback" ? "feedback" : "contacts"}...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Name
                  </th>
                  {activeTab === "feedback" ? (
                    <>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Designation
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Feedback
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Show Testimonial
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Message
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Status
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        Actions
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                      #{record.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#2d365b]">
                        {record.name}
                      </div>
                    </td>
                    
                    {activeTab === "feedback" ? (
                      <>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                          {record.designation}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600 max-w-md">
                          <div className="max-w-full">
                            {truncateText(record.feedback)}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleTestimonial(record.id)}
                            disabled={updatingStatus === record.id}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-md border-2 transition-all duration-300 ${
                              record.showTestimonial
                                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                                : "bg-white border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-500"
                            } ${updatingStatus === record.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={record.showTestimonial ? "Visible on website - Click to hide" : "Hidden on website - Click to show"}
                          >
                            {updatingStatus === record.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <FontAwesomeIcon 
                                icon={record.showTestimonial ? faEye : faEyeSlash} 
                                className="text-xs" 
                              />
                            )}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                          {record.email}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600 max-w-md">
                          <div className="max-w-full">
                            {truncateText(record.message)}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            {record.status === "replied" ? (
                              <div className="flex flex-col items-center space-y-1">
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 flex items-center space-x-1 min-w-[100px] justify-center">
                                  <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                                  <span>Replied</span>
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-1">
                                <button
                                  onClick={() => markAsReplied(record.id)}
                                  disabled={updatingStatus === record.id}
                                  className={`bg-amber-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-amber-600 transition-all duration-300 flex items-center space-x-1 shadow-sm min-w-[100px] justify-center ${
                                    updatingStatus === record.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {updatingStatus === record.id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon icon={faClock} className="text-xs" />
                                      <span>Pending</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleReply(record.email)}
                            className="bg-[#2d365b] text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-[#1e2a4a] transition-all duration-300 flex items-center space-x-1 shadow-sm mx-auto"
                          >
                            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                            <span>Reply</span>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">
              {activeTab === "feedback" ? "💬" : "📞"}
            </div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No {activeTab === "feedback" ? "Feedback" : "Contacts"} Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              No {activeTab === "feedback" ? "feedback" : "contact"} records match your search criteria. Try adjusting your filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#2d365b] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
            >
              Clear Filters
            </button>
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
                Filter {activeTab === "feedback" ? "Feedback" : "Contacts"}
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
              

              {/* Status Filter - Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {getStatusOptions().map((option) => (
                    <label 
                      key={option} 
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group text-sm"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="statusFilter"
                          value={option}
                          checked={statusFilter === option}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-3 h-3 text-[#2d365b] border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-[#2d365b] focus:ring-offset-2 transition-all duration-200 group-hover:border-[#2d365b]"
                        />
                        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-200 ${
                          statusFilter === option 
                            ? 'border-[#2d365b] bg-[#2d365b]' 
                            : 'border-transparent'
                        }`}></div>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {option === "All" ? "All Status" : option.charAt(0).toUpperCase() + option.slice(1)}
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
    </div>
  );
};

export default Hospitals;