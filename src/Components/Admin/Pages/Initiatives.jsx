import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import InitiativeForm from "../Forms/InitiativeForm";
import base_url from "../../../Config";

const Initiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const initiativesPerPage = 9;

  const deleteAlertRef = useRef(null);

  // API base URL - adjust according to your Laravel backend
  const API_BASE = base_url;

  // Fetch initiatives from API
  const fetchInitiatives = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}api/initiative/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch initiatives");
      }

      const result = await response.json();
      if (result.status && result.data) {
        // Transform API data to match frontend structure
        const transformedData = result.data.map((item) => ({
          id: item.id,
          title: item.title_name,
          category: item.category,
          status: "active", // Default status since API doesn't provide
          participants: 0, // Default participants since API doesn't provide
          description: item.description,
          image: item.image
            ? `${base_url}public/${item.image}`
            : "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        }));

        setInitiatives(transformedData);
      }
    } catch (error) {
      console.error("Error fetching initiatives:", error);
      setAlert({
        type: "error",
        message: "Failed to load initiatives",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

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

  const filteredInitiatives = initiatives.filter(
    (initiative) =>
      initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      initiative.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      initiative.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInitiatives.length / initiativesPerPage);
  const indexOfLastInitiative = currentPage * initiativesPerPage;
  const indexOfFirstInitiative = indexOfLastInitiative - initiativesPerPage;
  const currentInitiatives = filteredInitiatives.slice(
    indexOfFirstInitiative,
    indexOfLastInitiative
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}api/initiative/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete initiative");
      }

      const result = await response.json();

      if (result.status) {
        setInitiatives(
          initiatives.filter((initiative) => initiative.id !== id)
        );
        setAlert({
          type: "success",
          message: "Initiative deleted successfully!",
        });
        setDeleteConfirm(null);

        if (currentInitiatives.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        throw new Error(result.message || "Failed to delete initiative");
      }
    } catch (error) {
      console.error("Error deleting initiative:", error);
      setAlert({
        type: "error",
        message: "Failed to delete initiative",
      });
    }
  };

  const handleEdit = (initiative) => {
    setEditingInitiative(initiative);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title_name", formData.title);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);

      // Append image file if it exists
      if (formData.image && formData.image instanceof File) {
        submitData.append("image", formData.image);
      }

      // If image was removed in edit mode, we need to handle it
      // You might want to send a flag to the backend or handle it differently
      if (formData.hasRemovedImage && editingInitiative) {
        // You can send a flag to backend to remove the image
        // Or handle it in your API logic
        submitData.append("remove_image", "true");
      }

      let response;
      let url;

      if (editingInitiative) {
        // Update existing initiative
        url = `${API_BASE}api/initiative/update/${editingInitiative.id}`;
        response = await fetch(url, {
          method: "POST",
          body: submitData,
        });
      } else {
        // Create new initiative
        url = `${API_BASE}api/initiative/store`;
        response = await fetch(url, {
          method: "POST",
          body: submitData,
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save initiative");
      }

      const result = await response.json();

      if (result.status) {
        // Refresh the list after successful operation
        await fetchInitiatives();

        setAlert({
          type: "success",
          message: editingInitiative
            ? "Initiative updated successfully!"
            : "Initiative created successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to save initiative");
      }
    } catch (error) {
      console.error("Error saving initiative:", error);
      setAlert({
        type: "error",
        message: "Failed to save initiative",
      });
    } finally {
      setShowForm(false);
      setEditingInitiative(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingInitiative(null);
  };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-green-100 text-green-800 border border-green-300";
  //     case "planning":
  //       return "bg-yellow-100 text-yellow-800 border border-yellow-300";
  //     case "completed":
  //       return "bg-blue-100 text-blue-800 border border-blue-300";
  //     default:
  //       return "bg-gray-100 text-gray-800 border border-gray-300";
  //   }
  // };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Awareness":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "Support":
        return "bg-pink-100 text-pink-800 border border-pink-300";
      case "Youth":
        return "bg-indigo-100 text-indigo-800 border border-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d365b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading initiatives...</p>
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
              Initiatives Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage all foundation initiatives and programs
            </p>
          </div>

          {/* Add Initiative Button */}
          <button
            onClick={() => setShowForm(true)}
            className="group relative bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md border border-[#2d365b] hover:bg-white hover:text-[#2d365b] transition-all duration-300 ease-in-out overflow-hidden"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faPlus}
                className="transition-transform duration-300 group-hover:rotate-90 text-xs"
              />
              <span className="text-sm">Add New Initiative</span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search initiatives by title, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d365b] focus:border-transparent"
            />
          </div>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentInitiatives.map((initiative) => (
            <div
              key={initiative.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden group hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-500 ease-in-out cursor-pointer"
              onClick={() => setDetailModal(initiative)}
            >
              {/* Initiative Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={initiative.image}
                  alt={initiative.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                      initiative.category
                    )}`}
                  >
                    {initiative.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Initiative Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-[#2d365b] mb-2 line-clamp-2 group-hover:text-[#3a4a7a] transition-colors duration-300">
                  {initiative.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {initiative.description}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(initiative);
                    }}
                    className="flex-1 bg-[#2d365b] text-white py-1.5 rounded-md font-semibold hover:bg-[#1e2a4a] transition-all duration-300 flex items-center justify-center space-x-1 border border-[#2d365b] text-xs"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(initiative.id);
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
        {filteredInitiatives.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">📋</div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No Initiatives Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              {searchTerm
                ? "No initiatives match your search criteria."
                : "Get started by creating your first initiative to help spread mental health awareness."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#2d365b] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
              >
                Create Your First Initiative
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
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

      {/* Initiative Form Modal */}
      {showForm && (
        <InitiativeForm
          initiative={editingInitiative}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <CustomAlert
          type="delete"
          message="Are you sure you want to delete this initiative? This action cannot be undone."
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailModal(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-all duration-300 shadow-lg border border-[#2d365b]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            <div className="w-full h-[60vh] overflow-hidden">
              <img
                src={detailModal.image}
                alt={detailModal.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                    detailModal.category
                  )}`}
                >
                  {detailModal.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#2d365b] mb-3">
                {detailModal.title}
              </h3>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {detailModal.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Initiatives;
