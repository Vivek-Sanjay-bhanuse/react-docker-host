import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faMapMarkerAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import base_url from "../../../Config";

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
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
    if (event) {
      const imageUrl = event.image
        ? event.image.startsWith("http")
          ? event.image
          : `${base_url}public/${event.image}`
        : "";

      setFormData({
        title: event.title || "",
        date: event.date || "",
        location: event.location || "",
        description: event.description || "",
        image: null,
        imagePreview: "",
        existingImage: imageUrl,
      });
    } else {
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        image: null,
        imagePreview: "",
        existingImage: "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit description to 200 characters
    if (name === "description" && value.length > 200) return;

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
          existingImage: "",
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
      existingImage: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.description.length > 200)
      newErrors.description = "Max 200 characters allowed";

    if (!event && !formData.image && !formData.imagePreview) {
      newErrors.image = "Event image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: formData.title,
        date: formData.date,
        location: formData.location,
        description: formData.description,
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

  const getTomorrowDate = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  };

  const getDisplayImage = () => {
    if (formData.imagePreview) return formData.imagePreview;
    if (formData.existingImage) return formData.existingImage;
    return "";
  };

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
          p-4
          flex flex-col
          max-h-[90vh]
        "
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 bg-gradient-to-r from-[#2d365b] to-[#3a4a7a] text-white p-4 rounded-xl mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <p className="text-blue-100 text-sm">
              {event ? "Update your event" : "Add a new event"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 overflow-y-auto pr-2"
          style={{ maxHeight: "calc(90vh - 160px)" }}
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Event Title</span>
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input w-full h-12 text-base rounded-xl px-4 ${
                errors.title
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-[#2d365b]"
              }`}
              placeholder="Enter event title"
            />

            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Description</span>
              <span className="text-red-500">*</span>
              <p className="text-gray-500 ml-auto">
                {formData.description.length}/200
              </p>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              maxLength="200"
              placeholder="Write event description (max 200 characters)"
              className={`form-input w-full text-base rounded-xl p-3 resize-none ${
                errors.description
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-[#2d365b]"
              }`}
            ></textarea>

            <div className="flex justify-between text-sm">
              {errors.description && (
                <p className="text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Date + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label className="form-label flex items-center space-x-1">
                <span>Date</span>
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="date"
                  name="date"
                  min={getTomorrowDate()}
                  value={formData.date}
                  onChange={handleChange}
                  className={`form-input w-full h-12 pl-12 text-base rounded-xl pr-4 ${
                    errors.date
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#2d365b]"
                  }`}
                />
              </div>

              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="form-label flex items-center space-x-1">
                <span>Location</span>
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`form-input h-12 w-full pl-12 text-base rounded-xl ${
                    errors.location
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#2d365b]"
                  }`}
                  placeholder="Enter location"
                />
              </div>

              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Event Image</span>
              {!event && <span className="text-red-500">*</span>}
            </label>

            {hasImage && (
              <div className="relative">
                <img
                  src={getDisplayImage()}
                  className="w-full h-44 object-cover rounded-xl border"
                  alt="Event preview"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-sm hover:bg-red-600 transition-colors duration-200"
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
                    <p className="font-medium">Upload Event Image</p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, WEBP up to 2MB
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
              className="flex-1 bg-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2d365b] text-white py-3 rounded-xl font-semibold hover:bg-[#1e2a4a] shadow-lg disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting
                ? "Processing..."
                : event
                ? "Update Event"
                : "Create Event"}
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

export default EventForm;
