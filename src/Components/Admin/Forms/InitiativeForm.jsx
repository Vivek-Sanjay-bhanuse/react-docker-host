import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faImage,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

const InitiativeForm = ({ initiative, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
    imagePreview: "",
    hasRemovedImage: false, // Add this flag to track image removal
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
    if (initiative) {
      setFormData({
        title: initiative.title || "",
        category: initiative.category || "",
        description: initiative.description || "",
        image: null,
        imagePreview: initiative.image || "",
        hasRemovedImage: false, // Reset flag when editing
      });
    }
  }, [initiative]);

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

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only PNG, JPG, WEBP allowed",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
          hasRemovedImage: false, // Reset removal flag when new image is selected
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
      hasRemovedImage: true, // Set flag when image is removed
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Initiative title is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    // Description character limit validation
    if (formData.description.length > 100) {
      newErrors.description = "Description must be 100 characters or less";
    }

    // Updated validation logic
    if (!formData.imagePreview && !initiative?.image) {
      newErrors.image = "Initiative image is required";
    } else if (formData.hasRemovedImage && !formData.imagePreview) {
      // If image was removed and no new image is selected
      newErrors.image = "Initiative image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        await onSubmit({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          image: formData.image,
          imagePreview: formData.imagePreview,
          hasRemovedImage: formData.hasRemovedImage, // Pass the removal flag
          ...(initiative && {
            id: initiative.id,
            status: initiative.status,
            participants: initiative.participants,
          }),
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  // Determine which image to show
  const showImagePreview = formData.imagePreview || 
                          (initiative?.image && !formData.hasRemovedImage);

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
          p-5
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-[#2d365b] to-[#3a4a7a] text-white p-4 rounded-xl mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {initiative ? "Edit Initiative" : "Create New Initiative"}
            </h2>
            <p className="text-blue-100 text-sm">
              {initiative ? "Update your initiative" : "Add a new initiative"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title + Category in one line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Title */}
            <div className="space-y-1">
              <label className="form-label flex items-center space-x-1 text-sm font-medium text-gray-700">
                <span>Title</span>
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input w-full h-11 text-sm rounded-lg px-3 ${
                  errors.title
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-[#2d365b]"
                }`}
                placeholder="Enter title"
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="form-label flex items-center space-x-1 text-sm font-medium text-gray-700">
                <span>Category</span>
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input w-full h-11 text-sm rounded-lg px-3 ${
                  errors.category
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-[#2d365b]"
                }`}
                placeholder="Enter category"
              />

              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="form-label flex items-center space-x-1 text-sm font-medium text-gray-700">
              <span>Description</span>
              <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/100
              </span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={100}
              rows={2}
              className={`form-input w-full text-sm rounded-lg px-3 py-2 resize-none ${
                errors.description
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-[#2d365b]"
              }`}
              placeholder="Enter short description (max 100 characters)"
            />

            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="form-label flex items-center space-x-1 text-sm font-medium text-gray-700">
              <span>Initiative Image</span>
              <span className="text-red-500">*</span>
            </label>

            {showImagePreview && (
              <div className="relative">
                <img
                  src={formData.imagePreview || initiative?.image}
                  alt="Initiative preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5 rounded-full text-xs hover:bg-red-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            {!showImagePreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2d365b] transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 bg-[#2d365b] text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUpload} className="text-sm" />
                    </div>
                    <p className="font-medium text-gray-700 text-sm">Upload Image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                  </div>
                </label>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2d365b] text-white py-2.5 rounded-lg font-semibold hover:bg-[#1e2a4a] shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting
                ? "Processing..."
                : initiative
                ? "Update Initiative"
                : "Create Initiative"}
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

        .form-input {
          border: 1px solid #d1d5db;
          background-color: white;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          ring: 2px;
          ring-color: #2d365b;
        }
      `}</style>
    </div>
  );
};

export default InitiativeForm;