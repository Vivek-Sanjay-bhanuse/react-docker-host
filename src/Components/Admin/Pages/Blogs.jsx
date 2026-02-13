import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faCalendarAlt,
  faUser,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import BlogForm from "../Forms/BlogForm";
import base_url from "../../../Config";

const Blogs = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewContent, setViewContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("blogs"); // 'blogs', 'news', 'pending'
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [approvingContent, setApprovingContent] = useState(null);
  const contentPerPage = 6;
  const viewModalRef = useRef(null);

  // API endpoints
  const BLOG_API = `${base_url}api/blog`;
  const NEWS_API = `${base_url}api/news`;

  // Fetch all content
  const fetchContent = async () => {
    try {
      setLoading(true);

      // Fetch published blogs, pending blogs, and news concurrently
      const [publishedBlogsResponse, pendingBlogsResponse, newsResponse] = await Promise.all([
        fetch(`${BLOG_API}/get?status=1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: 1 })
        }),
        fetch(`${BLOG_API}/get?status=0`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: 0 })
        }),
        fetch(`${NEWS_API}/get`, { method: "POST" }),
      ]);

      if (!publishedBlogsResponse.ok || !pendingBlogsResponse.ok || !newsResponse.ok) {
        throw new Error("Failed to fetch content");
      }

      const publishedBlogsResult = await publishedBlogsResponse.json();
      const pendingBlogsResult = await pendingBlogsResponse.json();
      const newsResult = await newsResponse.json();

      // Transform published blogs
      const publishedBlogs = publishedBlogsResult.status
        ? publishedBlogsResult.data.map((item) => ({
            id: item.id,
            type: "blog",
            title: item.title,
            category: "Blog",
            status: "published",
            author: item.author,
            date: item.date,
            views: 0,
            content: item.content,
            description: item.description,
            image: null,
          }))
        : [];

      // Transform pending blogs
      const pendingBlogs = pendingBlogsResult.status
        ? pendingBlogsResult.data.map((item) => ({
            id: item.id,
            type: "pending",
            title: item.title,
            category: "Blog",
            status: "pending",
            author: item.author,
            date: item.date,
            views: 0,
            content: item.content,
            description: item.description,
            image: null,
          }))
        : [];

      // Transform news
      const news = newsResult.status
        ? newsResult.data.map((item) => ({
            id: item.id,
            type: "news",
            title: item.title,
            category: "News",
            status: "published",
            author: item.author,
            date: item.date,
            views: 0,
            content: item.content,
            description: "",
            image: item.image
              ? `${base_url}public/${item.image}`
              : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
          }))
        : [];

      setContent([...publishedBlogs, ...pendingBlogs, ...news]);
    } catch (error) {
      console.error("Error fetching content:", error);
      setAlert({
        type: "error",
        message: "Failed to load content",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Filter content based on active tab
  const filteredContent = content.filter((item) => {
    if (activeTab === "blogs") return item.type === "blog";
    if (activeTab === "news") return item.type === "news";
    if (activeTab === "pending") return item.type === "pending";
    return true;
  });

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        viewModalRef.current &&
        !viewModalRef.current.contains(event.target)
      ) {
        setViewContent(null);
      }
    };

    if (viewContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewContent]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContent.length / contentPerPage);
  const indexOfLastContent = currentPage * contentPerPage;
  const indexOfFirstContent = indexOfLastContent - contentPerPage;
  const currentContent = filteredContent.slice(
    indexOfFirstContent,
    indexOfLastContent
  );

  const handleDelete = async (id) => {
    try {
      const item = content.find((item) => item.id === id);
      if (!item) return;

      let response;
      if (item.type === "blog" || item.type === "pending") {
        response = await fetch(`${BLOG_API}/delete/${id}`, {
          method: "POST",
        });
      } else {
        response = await fetch(`${NEWS_API}/delete/${id}`, {
          method: "POST",
        });
      }

      if (!response.ok) {
        throw new Error("Failed to delete content");
      }

      const result = await response.json();

      if (result.status) {
        setContent(content.filter((item) => item.id !== id));
        setAlert({
          type: "success",
          message: "Content deleted successfully!",
        });
        setDeleteConfirm(null);

        // Adjust current page if needed after deletion
        if (currentContent.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        throw new Error(result.message || "Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      setAlert({
        type: "error",
        message: "Failed to delete content",
      });
    }
  };

  // Handle blog approval
  const handleApprove = async (id) => {
    try {
      setApprovingContent(id);
      const response = await fetch(`${BLOG_API}/status/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve blog");
      }

      const result = await response.json();

      if (result.status) {
        // Update the content in state
        setContent((prevContent) =>
          prevContent.map((item) =>
            item.id === id ? { ...item, type: "blog", status: "published" } : item
          )
        );
        
        setAlert({
          type: "success",
          message: "Blog approved successfully!",
        });
        
        // If we're on the pending tab and this was the last item, adjust page
        if (activeTab === "pending" && currentContent.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        throw new Error(result.message || "Failed to approve blog");
      }
    } catch (error) {
      console.error("Error approving blog:", error);
      setAlert({
        type: "error",
        message: "Failed to approve blog",
      });
    } finally {
      setApprovingContent(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;

      if (formData.type === "blog") {
        // Prepare blog data with status true for published blogs
        const blogData = {
          title: formData.title,
          date: formData.date,
          author: formData.author,
          description: formData.description,
          content: formData.content,
          status: true, // Always true when creating/editing from admin panel
        };

        if (editingContent) {
          // Update blog
          response = await fetch(`${BLOG_API}/update/${editingContent.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(blogData),
          });
        } else {
          // Create blog
          response = await fetch(`${BLOG_API}/store`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(blogData),
          });
        }
      } else {
        // Prepare news data with FormData for image upload
        const newsFormData = new FormData();
        newsFormData.append("title", formData.title);
        newsFormData.append("date", formData.date);
        newsFormData.append("author", formData.author);
        newsFormData.append("content", formData.content);

        // Append image if it exists and is a File object
        if (formData.image && formData.image instanceof File) {
          newsFormData.append("image", formData.image);
        }

        if (editingContent) {
          // Update news
          response = await fetch(`${NEWS_API}/update/${editingContent.id}`, {
            method: "POST",
            body: newsFormData,
          });
        } else {
          // Create news
          response = await fetch(`${NEWS_API}/store`, {
            method: "POST",
            body: newsFormData,
          });
        }
      }

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      const result = await response.json();

      if (result.status) {
        // Refresh the content after successful operation
        await fetchContent();

        setAlert({
          type: "success",
          message: editingContent
            ? "Content updated successfully!"
            : "Content created successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      setAlert({
        type: "error",
        message: "Failed to save content",
      });
    } finally {
      setShowForm(false);
      setEditingContent(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContent(null);
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

  const blogsCount = content.filter((item) => item.type === "blog").length;
  const newsCount = content.filter((item) => item.type === "news").length;
  const pendingCount = content.filter((item) => item.type === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d365b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
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
              Content Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage blogs, news, and pending content
            </p>
          </div>

          {/* Add Content Button - Smaller */}
          <button
            className="group relative bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md border border-[#2d365b] hover:bg-white hover:text-[#2d365b] transition-all duration-300 ease-in-out overflow-hidden"
            onClick={() => setShowForm(true)}
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faPlus}
                className="transition-transform duration-300 group-hover:rotate-90 text-xs"
              />
              <span className="text-sm">Create Content</span>
            </div>
          </button>
        </div>

        {/* Tab Navigation - Centered with Counts */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-1">
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setActiveTab("blogs");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "blogs"
                    ? "bg-[#2d365b] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm">Blogs</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === "blogs"
                      ? "bg-white text-[#2d365b]"
                      : "bg-[#2d365b] text-white"
                  }`}
                >
                  {blogsCount}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("news");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "news"
                    ? "bg-[#2d365b] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm">News</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === "news"
                      ? "bg-white text-[#2d365b]"
                      : "bg-[#2d365b] text-white"
                  }`}
                >
                  {newsCount}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("pending");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "pending"
                    ? "bg-[#ff9800] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm">Pending</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === "pending"
                      ? "bg-white text-[#ff9800]"
                      : "bg-[#ff9800] text-white"
                  }`}
                >
                  {pendingCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentContent.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md border overflow-hidden group hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-500 ease-in-out cursor-pointer ${
                item.type === "pending"
                  ? "border-orange-300 border-2"
                  : "border-gray-300"
              }`}
              onClick={() => setViewContent(item)}
            >
              {/* Pending Blog Card */}
              {item.type === "pending" && (
                <div className="p-4">
                  {/* Pending Badge */}
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <FontAwesomeIcon icon={faClock} className="mr-1 w-3" />
                      Pending Review
                    </span>
                  </div>
                  
                  {/* Title - Single line with ellipsis */}
                  <h3 className="text-base font-bold text-[#2d365b] mb-3 line-clamp-1 group-hover:text-[#3a4a7a] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2 w-3" />
                      <span className="line-clamp-1 text-xs">
                        {item.author}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="mr-2 w-3"
                      />
                      <span className="text-xs">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Published Blog Card */}
              {item.type === "blog" && (
                <div className="p-4">
                  {/* Title - Single line with ellipsis */}
                  <h3 className="text-base font-bold text-[#2d365b] mb-3 line-clamp-1 group-hover:text-[#3a4a7a] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2 w-3" />
                      <span className="line-clamp-1 text-xs">
                        {item.author}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="mr-2 w-3"
                      />
                      <span className="text-xs">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* News Card */}
              {item.type === "news" && (
                <div className="p-4">
                  {/* Title - Single line with ellipsis */}
                  <h3 className="text-base font-bold text-[#2d365b] mb-3 line-clamp-1 group-hover:text-[#3a4a7a] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2 w-3" />
                      <span className="line-clamp-1 text-xs">
                        {item.author}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="mr-2 w-3"
                      />
                      <span className="text-xs">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 p-3 border-t border-gray-200 bg-gray-50">
                {item.type === "pending" ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(item.id);
                      }}
                      disabled={approvingContent === item.id}
                      className="flex-1 bg-green-600 text-white py-1.5 rounded-md font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approvingContent === item.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Approving...</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(item.id);
                      }}
                      className="flex-1 bg-white text-red-600 py-1.5 rounded-md font-semibold hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-1 text-xs border border-red-300"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingContent(item);
                        setShowForm(true);
                      }}
                      className="flex-1 bg-[#2d365b] text-white py-1.5 rounded-md font-semibold hover:bg-[#1e2a4a] transition-all duration-300 flex items-center justify-center space-x-1 text-xs"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-xs" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(item.id);
                      }}
                      className="flex-1 bg-white text-red-600 py-1.5 rounded-md font-semibold hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-1 text-xs border border-red-300"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            {activeTab === "pending" ? (
              <>
                <div className="text-5xl mb-4 text-[#ff9800]">⏰</div>
                <h3 className="text-xl font-bold text-[#2d365b] mb-3">
                  No Pending Content
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                  There are no blogs pending review. All submitted blogs have been approved.
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4 text-[#2d365b]">📝</div>
                <h3 className="text-xl font-bold text-[#2d365b] mb-3">
                  No Content Found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                  {activeTab === "blogs"
                    ? "No blogs found. Get started by creating your first blog post."
                    : "No news found. Get started by creating your first news article."}
                </p>
                <button
                  className="bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
                  onClick={() => setShowForm(true)}
                >
                  Create Content
                </button>
              </>
            )}
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
                    ? activeTab === "pending"
                      ? "bg-[#ff9800] text-white shadow-md border border-[#ff9800]"
                      : "bg-[#2d365b] text-white shadow-md border border-[#2d365b]"
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

      {/* Blog Form Modal */}
      {showForm && (
        <BlogForm
          content={editingContent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <CustomAlert
          type="delete"
          message="Are you sure you want to delete this content? This action cannot be undone."
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      )}

      {/* View Blog Modal */}
      {(viewContent && (viewContent.type === "blog" || viewContent.type === "pending")) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div
            ref={viewModalRef}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden transform animate-scale-in"
          >
            {/* Close Button */}
            <button
              onClick={() => setViewContent(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-all duration-300 shadow-lg border border-[#2d365b]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            <div className="p-4 bg-white">
              {viewContent.type === "pending" && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    <FontAwesomeIcon icon={faClock} className="mr-2 w-3" />
                    Pending Review
                  </span>
                </div>
              )}
              
              <div className="mb-4 pr-8">
                <h3 className="text-lg font-bold text-[#2d365b] mb-2 line-clamp-2">
                  {viewContent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 w-3 text-[#2d365b]"
                    />
                    <span className="font-medium text-sm">
                      {viewContent.author}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-2 w-3 text-[#2d365b]"
                    />
                    <span className="font-medium text-sm">
                      {new Date(viewContent.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-base font-semibold text-[#2d365b] mb-2">
                  Description
                </h4>
                <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {viewContent.description}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <h4 className="text-base font-semibold text-[#2d365b] mb-2">
                  Content
                </h4>
                <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {viewContent.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View News Modal */}
      {viewContent && viewContent.type === "news" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div
            ref={viewModalRef}
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden transform animate-scale-in"
          >
            {/* Close Button */}
            <button
              onClick={() => setViewContent(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#2d365b] rounded-full flex items-center justify-center hover:bg-[#1e2a4a] transition-all duration-300 shadow-lg border border-[#2d365b]"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            <div className="w-full h-64 overflow-hidden">
              <img
                src={viewContent.image}
                alt={viewContent.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-white">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-[#2d365b] mb-2">
                  {viewContent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 w-3 text-[#2d365b]"
                    />
                    <span className="font-medium text-sm">
                      {viewContent.author}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-2 w-3 text-[#2d365b]"
                    />
                    <span className="font-medium text-sm">
                      {new Date(viewContent.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="text-gray-700 leading-relaxed text-base">
                  {viewContent.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
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
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Blogs;