import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import TeamForm from "../Forms/TeamForm";
import base_url from "../../../Config";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const membersPerPage = 9;

  // Ref for delete alert click-outside
  const deleteAlertRef = useRef(null);

  // API endpoints
  const API_BASE = `${base_url}api/team`;

  // Fetch all team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/get`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setTeamMembers(result.data);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch team members",
      });
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new team member
  const createTeamMember = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('speciality', formData.specialty);
      
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE}/store`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status) {
        await fetchTeamMembers(); // Refresh the team members list
        return true;
      } else {
        throw new Error(result.message || 'Failed to create team member');
      }
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  };

  // Update team member
  const updateTeamMember = async (id, formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', id);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('speciality', formData.specialty);
      
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE}/update`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.status) {
        await fetchTeamMembers(); // Refresh the team members list
        return true;
      } else {
        throw new Error(result.message || 'Failed to update team member');
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  };

  // Delete team member
  const deleteTeamMember = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.status) {
        await fetchTeamMembers(); // Refresh the team members list
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete team member');
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTeamMembers();
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
  const totalPages = Math.ceil(teamMembers.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = teamMembers.slice(indexOfFirstMember, indexOfLastMember);

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      setAlert({
        type: "success",
        message: "Team member deleted successfully!",
      });
      setDeleteConfirm(null);

      // Adjust current page if needed after deletion
      if (currentMembers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to delete team member",
      });
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData);
        setAlert({
          type: "success",
          message: "Team member updated successfully!",
        });
      } else {
        await createTeamMember(formData);
        setAlert({
          type: "success",
          message: "Team member added successfully!",
        });
      }
      setShowForm(false);
      setEditingMember(null);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to save team member",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  // Format image URL - add base URL if it's a relative path
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face";
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${base_url}public/${imagePath}`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d365b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team members...</p>
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
              Team Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage foundation team members and specialists
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Total Count Card */}
            <div className="bg-white rounded-lg shadow-md border px-4 py-2 text-center border-[#2d365b]">
              <div className="font-bold text-gray-600 text-sm">Total Members: {teamMembers.length}</div>
            </div>

            {/* Add Team Member Button */}
            <button
              onClick={() => setShowForm(true)}
              className="group relative bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md border border-[#2d365b] hover:bg-white hover:text-[#2d365b] transition-all duration-300 ease-in-out overflow-hidden"
            >
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="transition-transform duration-300 group-hover:rotate-90 text-xs"
                />
                <span className="text-sm">Add Member</span>
              </div>
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden group hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-500 ease-in-out cursor-pointer"
              onClick={() => setImageModal(member)}
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={formatImageUrl(member.image)}
                  alt={member.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Member Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-[#2d365b] mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{member.speciality}</p>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(member);
                    }}
                    className="flex-1 bg-[#2d365b] text-white py-1.5 rounded-md font-semibold hover:bg-[#1e2a4a] transition-all duration-300 flex items-center justify-center space-x-1 border border-[#2d365b] text-xs"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(member.id);
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
        {teamMembers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">👥</div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No Team Members Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              Get started by adding your first team member to showcase your specialists.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#2d365b] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
            >
              Add Your First Member
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

      {/* Team Form Modal */}
      {showForm && (
        <TeamForm
          member={editingMember}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation using CustomAlert with Click Outside */}
      {deleteConfirm && (
        <CustomAlert
          type="delete"
          message="Are you sure you want to delete this team member? This action cannot be undone."
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
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto'
            }}
          >
            <div className="p-4 flex items-center justify-center">
              <img
                src={formatImageUrl(imageModal.image)}
                alt={imageModal.name}
                className="max-w-full max-h-[80vh] object-contain"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '85vw',
                  maxHeight: '85vh'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;