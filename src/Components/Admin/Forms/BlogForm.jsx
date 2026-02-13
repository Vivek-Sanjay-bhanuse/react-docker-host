import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faUser,
  faImage,
  faUpload,
  faNewspaper,
  faBlog,
} from "@fortawesome/free-solid-svg-icons";

const BlogForm = ({ content, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    author: "",
    type: "blog",
    description: "",
    content: "",
    image: null,
    imagePreview: "",
    hasRemovedImage: false, // Add flag for image removal
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
    if (content) {
      setFormData({
        title: content.title || "",
        date: content.date || "",
        author: content.author || "",
        type: content.type || "blog",
        description: content.description || "",
        content: content.content || "",
        image: null,
        imagePreview: content.image || "",
        hasRemovedImage: false,
      });
    }
  }, [content]);

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

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type: type,
      description: "", // Reset description when switching types
      image: null,
      imagePreview: "",
      hasRemovedImage: false,
    }));
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

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.author.trim())
      newErrors.author = "Author/Organization name is required";

    // Blog validations
    if (formData.type === "blog") {
      if (!formData.description.trim())
        newErrors.description = "Blog summary is required";
      if (!formData.content.trim())
        newErrors.content = "Blog content is required";

      // Check word count for blog summary
      if (formData.description.trim()) {
        const charCount = formData.description.length;
        if (charCount > 200) {
          newErrors.description = "Blog summary must be 200 characters or less";
        }
      }
    }

    // News validations
    if (formData.type === "news") {
      if (!formData.content.trim())
        newErrors.content = "News content is required";

      if (formData.content.trim()) {
        const charCount = formData.content.length;
        if (charCount > 200) {
          newErrors.content = "News content must be 200 characters or less";
        }
      }
      // Image validation for news
      if (!formData.imagePreview && !content?.image) {
        newErrors.image = "News image is required";
      } else if (formData.hasRemovedImage && !formData.imagePreview) {
        // If image was removed and no new image is selected
        newErrors.image = "News image is required";
      }
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
          date: formData.date,
          author: formData.author,
          type: formData.type,
          description: formData.description,
          content: formData.content,
          image: formData.image,
          imagePreview: formData.imagePreview,
          hasRemovedImage: formData.hasRemovedImage,
          ...(content && {
            id: content.id,
            status: content.status,
            views: content.views,
            category: content.category,
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

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getCharCount = (text) => {
    return text ? text.length : 0;
  };

  // Determine which image to show
  const showImagePreview =
    formData.imagePreview || (content?.image && !formData.hasRemovedImage);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        ref={formRef}
        className="
          bg-white rounded-2xl 
          w-full max-w-4xl 
          mx-4
          shadow-2xl 
          border border-gray-200 
          animate-scale-in 
          p-6
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 bg-gradient-to-r from-[#2d365b] to-[#3a4a7a] text-white p-4 rounded-xl mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {content ? "Edit Content" : "Create New Content"}
            </h2>
            <p className="text-blue-100 text-sm">
              {content ? "Update your content" : "Add new blog or news"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Content Type Radio Buttons */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Content Type</span>
              <span className="text-red-500">*</span>
            </label>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => !content && handleTypeChange("blog")}
                disabled={!!content}
                className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  formData.type === "blog"
                    ? "bg-[#f47058] text-white border-[#f47058]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#f47058]"
                } ${content ? " cursor-not-allowed" : ""}`}
              >
                <FontAwesomeIcon icon={faBlog} />
                <span>Blog</span>
              </button>

              <button
                type="button"
                onClick={() => !content && handleTypeChange("news")}
                disabled={!!content}
                className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  formData.type === "news"
                    ? "bg-[#f47058] text-white border-[#f47058]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#f47058]"
                } ${content ? " cursor-not-allowed" : ""}`}
              >
                <FontAwesomeIcon icon={faNewspaper} />
                <span>News</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Title</span>
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
              placeholder="Enter content title"
            />

            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Date + Author */}
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
                  max={getTodayDate()}
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

            {/* Author */}
            <div className="space-y-2">
              <label className="form-label flex items-center space-x-1">
                <span>Author/Organization</span>
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`form-input h-12 w-full pl-12 text-base rounded-xl ${
                    errors.author
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#2d365b]"
                  }`}
                  placeholder="Enter author or organization"
                />
              </div>

              {errors.author && (
                <p className="text-red-500 text-sm">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Blog Specific Fields */}
          {formData.type === "blog" && (
            <>
              {/* Blog Summary */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-1">
                  <span>Blog Summary</span>
                  <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-500 ml-auto">
                    {getCharCount(formData.description)}/200 characters
                  </span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`form-input w-full text-base rounded-xl px-4 py-3 resize-none ${
                    errors.description
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#2d365b]"
                  }`}
                  placeholder="Enter blog summary (max 200 words)"
                />

                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Blog Content */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-1">
                  <span>Blog Content</span>
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={`form-input w-full text-base rounded-xl px-4 py-3 resize-none ${
                    errors.content
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#2d365b]"
                  }`}
                  placeholder="Enter blog content"
                />

                {errors.content && (
                  <p className="text-red-500 text-sm">{errors.content}</p>
                )}
              </div>
            </>
          )}

          {/* News Specific Fields */}
          {formData.type === "news" && (
            <>
              {/* News Content */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-1">
                  <span>News Content</span>
                  <span className="text-red-500">*</span>
                  {/* Word Count */}
                  <span className="text-sm text-gray-500 ml-auto">
                    {getCharCount(formData.content)}/200 characters
                  </span>
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  className={`form-input w-full text-base rounded-xl px-4 py-3 resize-none ${
                    errors.content
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#2d365b]"
                  }`}
                  placeholder="Enter news content (max 200 words)"
                />

                {errors.content && (
                  <p className="text-red-500 text-sm">{errors.content}</p>
                )}
              </div>

              {/* News Image Upload */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-1">
                  <span>News Image</span>
                  <span className="text-red-500">*</span>
                </label>

                {showImagePreview && (
                  <div className="relative">
                    <img
                      src={formData.imagePreview || content?.image}
                      className="w-full h-44 object-cover rounded-xl border"
                      alt="News preview"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-sm hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}

                {!showImagePreview && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-[#2d365b] text-white rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faUpload} />
                        </div>
                        <p className="font-medium">Upload News Image</p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, WEBP (max 2MB)
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2d365b] text-white py-3 rounded-xl font-semibold hover:bg-[#1e2a4a] shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing..."
                : content
                ? "Update Content"
                : "Create Content"}
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

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
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

export default BlogForm;
