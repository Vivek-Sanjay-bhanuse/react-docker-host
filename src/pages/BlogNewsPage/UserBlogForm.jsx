import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCalendarAlt, faUser, faBlog } from "@fortawesome/free-solid-svg-icons";

const UserBlogForm = ({ content, onSubmit, onCancel }) => {
  const initialState = {
    title: "",
    date: "",
    author: "",
    type: "blog", // fixed to blog
    description: "",
    content: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const formRef = useRef(null);
  const toastTimerRef = useRef(null);

  // click outside -> close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [onCancel]);

  // populate for edit
  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        date: content.date || "",
        author: content.author || "",
        type: "blog",
        description: content.description || "",
        content: content.content || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.author.trim()) newErrors.author = "Author/Organization name is required";

    // Date must not be in future
    if (formData.date) {
      const selected = new Date(formData.date);
      const today = new Date();
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (selected > today) {
        newErrors.date = "Date cannot be in the future";
      }
    }

    // Blog validations
    if (!formData.description.trim()) newErrors.description = "Blog summary is required";
    if (!formData.content.trim()) newErrors.content = "Blog content is required";

    if (formData.description.trim()) {
      const charCount = formData.description.length;
      if (charCount > 200) {
        newErrors.description = "Blog summary must be 200 characters or less";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // show toast then auto-close modal after toast hides
  const showSuccessToast = (message = "Saved successfully") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    setToast({ show: true, message });

    // Hide toast after 2s, then close modal shortly after hide (300ms for fade)
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: "" });

      // close form after small fade delay
      setTimeout(() => {
        onCancel();
      }, 300);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        title: formData.title,
        date: formData.date,
        author: formData.author,
        type: "blog",
        description: formData.description,
        content: formData.content,
        ...(content && {
          id: content.id,
          status: content.status,
          views: content.views,
          category: content.category,
        }),
      });

      // show toast and auto-close
      showSuccessToast(content ? "Blog updated" : "Blog created");

      // If creating new blog, reset form so reopening shows blank
      if (!content) {
        setFormData(initialState);
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      // Optionally: set an error toast
      setToast({ show: true, message: "Submission failed" });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getCharCount = (text) => (text ? text.length : 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 mt-12 animate-fade-in">
      <div
        ref={formRef}
        className="bg-white rounded-2xl w-full max-w-4xl mx-4 shadow-2xl border border-gray-200 animate-scale-in p-4 max-h-[77vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 bg-gradient-to-r from-[#f47058] to-[#7883ae] text-white p-4 rounded-xl mb-4">
          <div>
            <h2 className="text-xl font-bold">{content ? "Edit Blog" : "Create New Blog"}</h2>
            <p className="text-blue-100 text-sm">{content ? "Update your blog" : "Add new blog post"}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 bg-white/10 p-2 rounded-md hover:bg-white/20"
            aria-label="close"
          >
            <FontAwesomeIcon icon={faTimes} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className={`form-input w-full h-12 text-base rounded-xl px-4 ${errors.title ? "border-red-500 focus:border-red-500" : "focus:border-[#2d365b]"}`}
              placeholder="Enter blog title"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Date + Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="form-label flex items-center space-x-1">
                <span>Date</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  name="date"
                  max={getTodayDate()}
                  value={formData.date}
                  onChange={handleChange}
                  className={`form-input w-full h-12 pl-12 text-base rounded-xl pr-4 ${errors.date ? "border-red-500 focus:border-red-500" : "focus:border-[#2d365b]"}`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <label className="form-label flex items-center space-x-1">
                <span>Author/Organization</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`form-input h-12 w-full pl-12 text-base rounded-xl ${errors.author ? "border-red-500 focus:border-red-500" : "focus:border-[#2d365b]"}`}
                  placeholder="Enter author or organization"
                />
              </div>
              {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
            </div>
          </div>

          {/* Blog Summary */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-1">
              <span>Blog Summary</span>
              <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 ml-auto">{getCharCount(formData.description)}/200 characters</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`form-input w-full text-base rounded-xl px-4 py-3 resize-none ${errors.description ? "border-red-500 focus:border-red-500" : "focus:border-[#2d365b]"}`}
              placeholder="Enter blog summary (max 200 characters)"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
              className={`form-input w-full text-base rounded-xl px-4 py-3 resize-none ${errors.content ? "border-red-500 focus:border-red-500" : "focus:border-[#2d365b]"}`}
              placeholder="Enter blog content"
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300">
              Cancel
            </button>

            <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#f47058] text-white py-3 rounded-xl font-semibold hover:bg-[#1e2a4a] shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Processing..." : content ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>

        {/* toast */}
        <div
          aria-live="polite"
          className={`pointer-events-none fixed right-6 bottom-6 z-50 transition-all duration-300 ${toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg text-sm font-medium pointer-events-auto">
            {toast.message}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
        .animate-scale-in { animation: scale-in 0.35s ease-out; }
        .form-label { font-weight: 600; color: #374151; font-size: 0.875rem; }
        .form-input { border: 1px solid #d1d5db; background-color: white; transition: all 0.3s ease; }
        .form-input:focus { outline: none; ring: 2px; ring-color: #2d365b; }
      `}</style>
    </div>
  );
};

export default UserBlogForm;
