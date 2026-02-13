import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import GalleryForm from "../Forms/GalleryForm";
import base_url from "../../../Config";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const imagesPerPage = 9;

  const deleteAlertRef = useRef(null);
  const categories = ['All', 'Events', 'Activities', 'Campaigns', 'Team', 'Media', 'Other'];

  // API endpoints
  const API_BASE = `${base_url}api/gallery`;

  // Fetch all gallery images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();

      if (result.status && result.data) {
        setImages(result.data);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch gallery images",
      });
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new gallery image
  const createImage = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('name', formData.title); // Using title as name since name is required
      formDataToSend.append('category', formData.category);

      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE}/store`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status) {
        await fetchImages(); // Refresh the images list
        return true;
      } else {
        throw new Error(result.message || 'Failed to create gallery image');
      }
    } catch (error) {
      console.error("Error creating image:", error);
      throw error;
    }
  };

  // Update gallery image
  const updateImage = async (id, formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('name', formData.title); // Using title as name since name is required
      formDataToSend.append('category', formData.category);

      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE}/update`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status) {
        await fetchImages(); // Refresh the images list
        return true;
      } else {
        throw new Error(result.message || 'Failed to update gallery image');
      }
    } catch (error) {
      console.error("Error updating image:", error);
      throw error;
    }
  };

  // Delete gallery image
  const deleteImage = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.status) {
        await fetchImages(); // Refresh the images list
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete gallery image');
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchImages();
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

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(image => image.category === selectedCategory);

  const categoryCounts = {
    'All': images.length,
    'Events': images.filter(img => img.category === 'Events').length,
    'Activities': images.filter(img => img.category === 'Activities').length,
    'Campaigns': images.filter(img => img.category === 'Campaigns').length,
    'Team': images.filter(img => img.category === 'Team').length,
    'Media': images.filter(img => img.category === 'Media').length,
    'Other': images.filter(img => img.category === 'Other').length,
  };

  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      setAlert({
        type: "success",
        message: "Image deleted successfully!",
      });
      setDeleteConfirm(null);

      if (currentImages.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to delete image",
      });
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingImage) {
        await updateImage(editingImage.id, formData);
        setAlert({
          type: "success",
          message: "Image updated successfully!",
        });
      } else {
        await createImage(formData);
        setAlert({
          type: "success",
          message: "Image added successfully!",
        });
      }
      setShowForm(false);
      setEditingImage(null);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to save image",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingImage(null);
  };

  // Format image URL - add base URL if it's a relative path
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop";

    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${base_url}public/${imagePath}`;
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
          <p className="mt-4 text-gray-600">Loading gallery...</p>
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
              Gallery Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage all gallery images and media content
            </p>
          </div>

          {/* Add Image Button */}
          <button
            onClick={() => setShowForm(true)}
            className="group relative bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md border border-[#2d365b] hover:bg-white hover:text-[#2d365b] transition-all duration-300 ease-in-out overflow-hidden"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faPlus}
                className="transition-transform duration-300 group-hover:rotate-90 text-xs"
              />
              <span className="text-sm">Add New Image</span>
            </div>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div
            className="
      bg-white rounded-lg shadow-md border border-gray-300 p-2 
      inline-flex 
      overflow-x-auto 
      scrollbar-hide 
      max-w-full 
      space-x-2
    "
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center space-x-2 text-sm whitespace-nowrap ${selectedCategory === category
                    ? "bg-[#2d365b] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#2d365b]"
                  }`}
              >
                <span>{category}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category
                      ? "bg-white text-[#2d365b]"
                      : "bg-[#2d365b] text-white"
                    }`}
                >
                  {categoryCounts[category]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden group hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-500 ease-in-out cursor-pointer"
              onClick={() => setImageModal(image)}
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={formatImageUrl(image.image)}
                  alt={image.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300`}
                  >
                    {image.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Image Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-[#2d365b] mb-2 line-clamp-2 group-hover:text-[#3a4a7a] transition-colors duration-300">
                  {image.title}
                </h3>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(image);
                    }}
                    className="flex-1 bg-[#2d365b] text-white py-1.5 rounded-md font-semibold hover:bg-[#1e2a4a] transition-all duration-300 flex items-center justify-center space-x-1 border border-[#2d365b] text-xs"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(image.id);
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
        {filteredImages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">🖼️</div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No Images Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              Get started by uploading your first image to showcase your events and activities.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#2d365b] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
            >
              Upload Your First Image
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-300 text-sm ${pageNum === currentPage
                    ? "bg-[#2d365b] text-white shadow-md border border-[#2d365b]"
                    : "bg-white text-gray-700 shadow-md border border-gray-300 hover:border-[#2d365b] hover:bg-gray-50"
                  } ${pageNum === "..."
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

      {/* Gallery Form Modal */}
      {showForm && (
        <GalleryForm
          image={editingImage}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <CustomAlert
          type="delete"
          message="Are you sure you want to delete this image? This action cannot be undone."
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
                  <span className="font-medium">Category: {imageModal.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;