import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faCalendarAlt,
  faMapMarkerAlt,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import EventForm from "../Forms/EventForm";
import base_url from "../../../Config";
const Events = () => {
  const [events, setEvents] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const eventsPerPage = 9;

  // Ref for delete alert click-outside
  const deleteAlertRef = useRef(null);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base_url}api/events/get`);
      const result = await response.json();

      if (result.status && result.data) {
        setEvents(result.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch events",
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new event
  const createEvent = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("description",formData.description);
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${base_url}api/events/store`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status) {
        await fetchEvents(); // Refresh the events list
        return true;
      } else {
        throw new Error(result.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  // Update event
  const updateEvent = async (id, formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", id);

      formDataToSend.append("title", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("description",formData.description);

      if (formData.image && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${base_url}api/events/update`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status) {
        await fetchEvents(); // Refresh the events list
        return true;
      } else {
        throw new Error(result.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`${base_url}api/events/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.status) {
        await fetchEvents(); // Refresh the events list
        return true;
      } else {
        throw new Error(result.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  // Get events count
  // const getEventsCount = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE}/count/all`);
  //     const result = await response.json();
  //     return result.total_events || 0;
  //   } catch (error) {
  //     console.error("Error fetching events count:", error);
  //     return 0;
  //   }
  // };

  // Initial data fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Click outside to close delete alert
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deleteAlertRef.current &&
        !deleteAlertRef.current.contains(event.target)
      ) {
        setDeleteConfirm(null);
      }
    };

    if (deleteConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteConfirm]);

  // Pagination calculations
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setAlert({
        type: "success",
        message: "Event deleted successfully!",
      });
      setDeleteConfirm(null);

      // Adjust current page if needed after deletion
      if (currentEvents.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to delete event",
      });
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        setAlert({
          type: "success",
          message: "Event updated successfully!",
        });
      } else {
        await createEvent(formData);
        setAlert({
          type: "success",
          message: "Event created successfully!",
        });
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to save event",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const getStatusColor = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return "bg-green-100 text-green-800 border border-green-300";
    } else {
      return "bg-blue-100 text-blue-800 border border-blue-300";
    }
  };

  const getStatusText = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return "completed";
    } else {
      return "upcoming";
    }
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

  // Format image URL - add base URL if it's a relative path
  const formatImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop";

    if (imagePath.startsWith("http")) {
      return imagePath;
    } else {
      // Assuming your backend serves images from public folder
      return `${base_url}public/${imagePath}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d365b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
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
              Events Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage all foundation events and activities
            </p>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => setShowForm(true)}
            className="group relative bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md border border-[#2d365b] hover:bg-white hover:text-[#2d365b] transition-all duration-300 ease-in-out overflow-hidden"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faPlus}
                className="transition-transform duration-300 group-hover:rotate-90 text-xs"
              />
              <span className="text-sm">Add New Event</span>
            </div>
          </button>
        </div>

        {/* Stats Cards - More Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Events Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 transform hover:scale-102 transition-all duration-300 ease-in-out group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#2d365b] mb-1">
                  {events.length}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  Total Events
                </div>
              </div>
              <div className="w-12 h-12 bg-[#2d365b] rounded-lg flex items-center justify-center transition-transform duration-300">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-white text-xl"
                />
              </div>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 transform hover:scale-102 transition-all duration-300 ease-in-out group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#2d365b] mb-1">
                  {
                    events.filter((e) => getStatusText(e.date) === "upcoming")
                      .length
                  }
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  Upcoming Events
                </div>
              </div>
              <div className="w-12 h-12 bg-[#2d365b] rounded-lg flex items-center justify-center transition-transform duration-300">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-white text-xl"
                />
              </div>
            </div>
          </div>

          {/* Completed Events Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 transform hover:scale-102 transition-all duration-300 ease-in-out group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#2d365b] mb-1">
                  {
                    events.filter((e) => getStatusText(e.date) === "completed")
                      .length
                  }
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  Completed Events
                </div>
              </div>
              <div className="w-12 h-12 bg-[#2d365b] rounded-lg flex items-center justify-center transition-transform duration-300">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-white text-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden group hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-500 ease-in-out cursor-pointer"
              onClick={() => setImageModal(event)}
            >
              {/* Event Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={formatImageUrl(event.image)}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      event.date
                    )}`}
                  >
                    {getStatusText(event.date)}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Event Content */}
              <div className="p-4">
                {/* Event Title */}
                <h3 className="text-base font-bold text-[#2d365b] mb-2 line-clamp-2 group-hover:text-[#3a4a7a] transition-colors duration-300">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-gray-700 text-sm">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-[#2d365b] mr-2 w-3"
                    />
                    <span className="font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700 text-sm">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-[#2d365b] mr-2 w-3"
                    />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                    className="flex-1 bg-[#2d365b] text-white py-1.5 rounded-md font-semibold hover:bg-[#1e2a4a] transition-all duration-300 flex items-center justify-center space-x-1 border border-[#2d365b] text-xs"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(event.id);
                    }}
                    className="flex-1 bg-white text-red-600 py-1.5 rounded-md font-semibold hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-1 border border-red-300 text-xs"
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
        {events.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">Calendar</div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No Events Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              Get started by creating your first event to help spread mental
              health awareness in the community.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#2d365b] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
            >
              Create Your First Event
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

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation using CustomAlert with Click Outside */}
      {deleteConfirm && (
        <CustomAlert
          type="delete"
          message="Are you sure you want to delete this event? This action cannot be undone."
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      )}

      {/* Image Modal */}
      {imageModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImageModal(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-all duration-300 shadow-lg border border-[#2d365b]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            <div className="w-full h-[60vh] overflow-hidden">
              <img
                src={formatImageUrl(imageModal.image)}
                alt={imageModal.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <h3 className="text-xl font-bold text-[#2d365b] mb-2">
                {imageModal.title}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-2 w-3 text-[#2d365b]"
                  />
                  <span className="font-medium">
                    {new Date(imageModal.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2 w-3 text-[#2d365b]"
                  />
                  <span>{imageModal.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="mr-2 w-3 text-[#2d365b]"
                  />
                  <span className="whitespace-pre-line break-words leading-relaxed ">{imageModal.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
