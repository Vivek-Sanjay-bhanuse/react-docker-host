import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import base_url from "../../../Config";

const TeamForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    image: null,
    imagePreview: "",
    existingImage: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  useEffect(() => {
    if (member) {
      // Format the image URL properly for display
      const imageUrl = member.image 
        ? (member.image.startsWith('http') ? member.image : `${base_url}public/${member.image}`)
        : "";
      
      setFormData({
        name: member.name || "",
        specialty: member.speciality || "",
        image: null,
        imagePreview: "",
        existingImage: imageUrl,
      });
    } else {
      // Reset form for new member
      setFormData({
        name: "",
        specialty: "",
        image: null,
        imagePreview: "",
        existingImage: "",
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 2MB",
        }));
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only PNG, JPG allowed",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
          existingImage: "", // Clear existing image when new one is selected
        }));
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
      existingImage: "", // Also clear existing image
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.specialty.trim())
      newErrors.specialty = "Specialty is required";

    // Image is required for both create and edit
    if (!formData.imagePreview && !formData.existingImage)
      newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name: formData.name,
        specialty: formData.specialty,
        image: formData.image,
        imagePreview: formData.imagePreview,
        existingImage: formData.existingImage,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which image to display
  const getDisplayImage = () => {
    if (formData.imagePreview) {
      return formData.imagePreview; // Newly selected image preview
    }
    if (formData.existingImage) {
      return formData.existingImage; // Existing image from backend
    }
    return "";
  };

  // Check if we have any image to display
  const hasImage = formData.imagePreview || formData.existingImage;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        ref={formRef}
        className="
          bg-white rounded-2xl 
          w-full max-w-xl 
          mx-4
          shadow-2xl 
          border border-gray-200 
          animate-scale-in 
          p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 bg-gradient-to-r from-[#2d365b] to-[#3a4a7a] text-white p-4 rounded-xl mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {member ? "Edit Team Member" : "Add New Team Member"}
            </h2>
            <p className="text-blue-100 text-sm">
              {member
                ? "Update team member details"
                : "Add a new team member to your foundation"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Full Name</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Dr. Vivek Patil"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d365b] focus:border-transparent transition-all duration-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Specialty - Input Field */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Specialty</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="e.g., Clinical Psychologist, Psychiatric Counselor"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d365b] focus:border-transparent transition-all duration-300"
            />
            {errors.specialty && (
              <p className="text-red-500 text-sm">{errors.specialty}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Profile Image</span>
              <span className="text-red-500">*</span>
            </label>

            {hasImage && (
              <div className="relative">
                <img
                  src={getDisplayImage()}
                  alt="Preview"
                  className="w-full h-44 object-cover rounded-xl border"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-sm hover:bg-red-600 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            {!hasImage && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2d365b] transition-colors duration-200">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-[#2d365b] text-white rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-colors duration-200">
                      <FontAwesomeIcon icon={faUpload} />
                    </div>
                    <p className="font-medium">Upload Profile Image</p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </label>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2d365b] text-white py-3 rounded-xl font-semibold hover:bg-[#1e2a4a] shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : member
                ? "Update Member"
                : "Add Member"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.35s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TeamForm;