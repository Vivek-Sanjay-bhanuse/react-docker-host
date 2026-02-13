import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faSearch,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import * as XLSX from "xlsx";
import base_url from "../../../Config";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Donations = () => {
  // const [donations, setDonations] = useState([
  //   {
  //     id: 1,
  //     donorName: "Dr. Rajesh Kumar",
  //     email: "rajesh@example.com",
  //     mobile: "+91 9876543210",
  //     amount: 5000,
  //     currency: "INR",
  //     paymentMethod: "Razorpay",
  //     status: "completed",
  //     date: "2024-01-15",
  //     transactionId: "TXN001234",
  //   },
  //   {
  //     id: 2,
  //     donorName: "Ms. Priya Singh",
  //     email: "priya@example.com",
  //     mobile: "+91 9876543211",
  //     amount: 2500,
  //     currency: "INR",
  //     paymentMethod: "PayPal",
  //     status: "completed",
  //     date: "2024-01-14",
  //     transactionId: "TXN001235",
  //   },
  //   {
  //     id: 3,
  //     donorName: "Mr. Amit Patel",
  //     email: "amit@example.com",
  //     mobile: "+91 9876543212",
  //     amount: 10000,
  //     currency: "INR",
  //     paymentMethod: "Bank Transfer",
  //     status: "pending",
  //     date: "2024-01-13",
  //     transactionId: "TXN001236",
  //   },
  //   {
  //     id: 4,
  //     donorName: "Dr. Sneha Sharma",
  //     email: "sneha@example.com",
  //     mobile: "+91 9876543213",
  //     amount: 7500,
  //     currency: "INR",
  //     paymentMethod: "Razorpay",
  //     status: "completed",
  //     date: "2024-01-12",
  //     transactionId: "TXN001237",
  //   },
  //   {
  //     id: 5,
  //     donorName: "Mr. Vikram Joshi",
  //     email: "vikram@example.com",
  //     mobile: "+91 9876543214",
  //     amount: 3000,
  //     currency: "INR",
  //     paymentMethod: "PayPal",
  //     status: "completed",
  //     date: "2024-01-11",
  //     transactionId: "TXN001238",
  //   },
  //   {
  //     id: 6,
  //     donorName: "Ms. Anjali Mehta",
  //     email: "anjali@example.com",
  //     mobile: "+91 9876543215",
  //     amount: 15000,
  //     currency: "INR",
  //     paymentMethod: "Bank Transfer",
  //     status: "pending",
  //     date: "2024-01-10",
  //     transactionId: "TXN001239",
  //   },
  //   {
  //     id: 7,
  //     donorName: "Dr. Ramesh Iyer",
  //     email: "ramesh@example.com",
  //     mobile: "+91 9876543216",
  //     amount: 8000,
  //     currency: "INR",
  //     paymentMethod: "Razorpay",
  //     status: "completed",
  //     date: "2024-01-09",
  //     transactionId: "TXN001240",
  //   },
  //   {
  //     id: 8,
  //     donorName: "Mrs. Sunita Reddy",
  //     email: "sunita@example.com",
  //     mobile: "+91 9876543217",
  //     amount: 12000,
  //     currency: "INR",
  //     paymentMethod: "PayPal",
  //     status: "completed",
  //     date: "2024-01-08",
  //     transactionId: "TXN001241",
  //   },
  //   {
  //     id: 9,
  //     donorName: "Mr. Arjun Malhotra",
  //     email: "arjun@example.com",
  //     mobile: "+91 9876543218",
  //     amount: 6000,
  //     currency: "INR",
  //     paymentMethod: "Bank Transfer",
  //     status: "pending",
  //     date: "2024-01-07",
  //     transactionId: "TXN001242",
  //   },
  //   {
  //     id: 10,
  //     donorName: "Dr. Neha Gupta",
  //     email: "neha@example.com",
  //     mobile: "+91 9876543219",
  //     amount: 9000,
  //     currency: "INR",
  //     paymentMethod: "Razorpay",
  //     status: "completed",
  //     date: "2024-01-06",
  //     transactionId: "TXN001243",
  //   },
  //   {
  //     id: 11,
  //     donorName: "Mr. Sanjay Verma",
  //     email: "sanjay@example.com",
  //     mobile: "+91 9876543220",
  //     amount: 11000,
  //     currency: "INR",
  //     paymentMethod: "PayPal",
  //     status: "completed",
  //     date: "2024-01-05",
  //     transactionId: "TXN001244",
  //   },
  //   {
  //     id: 12,
  //     donorName: "Ms. Kavita Joshi",
  //     email: "kavita@example.com",
  //     mobile: "+91 9876543221",
  //     amount: 7000,
  //     currency: "INR",
  //     paymentMethod: "Bank Transfer",
  //     status: "pending",
  //     date: "2024-01-04",
  //     transactionId: "TXN001245",
  //   },
  // ]);
  const [donations, setDonations] = useState([]);

  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const donationsPerPage = 10;
  const filterRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.post(`${base_url}api/donation/get`);
      setDonations(res.data.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  // Click outside to close filter modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    };

    if (showFilterModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterModal]);

  // Filter donations based on search and date range
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.phone.includes(searchQuery) ||
      donation.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const donationDate = new Date(donation.date);
    const matchesStartDate = !startDate || donationDate >= new Date(startDate);
    const matchesEndDate = !endDate || donationDate <= new Date(endDate);

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = filteredDonations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  // Stats
  const totalDonations = filteredDonations.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Donations");

      // Columns
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Donor Name", key: "name", width: 25 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 15 },
        { header: "Phone", key: "phone", width: 15 },
        { header: "Email", key: "email", width: 25 },
        { header: "Receipt", key: "receipt", width: 20 },
      ];

      // Add rows + hold images
      for (let donation of filteredDonations) {
        worksheet.addRow({
          id: donation.id,
          name: donation.name,
          amount: `₹${Number(donation.amount).toLocaleString()}`,
          date: new Date(donation.date).toLocaleDateString("en-IN"),
          phone: donation.phone,
          email: donation.email,
          receipt: "", // image goes here
        });

        // If image exists
        if (donation.receipt_path) {
          const filename = donation.receipt_path.split("/").pop();
          const imageUrl = `${base_url}api/donation-image/${filename}`;

          const response = await fetch(imageUrl, { mode: "cors" });
          const buffer = await response.arrayBuffer();

          const ext = donation.receipt_path.split(".").pop().toLowerCase();

          const imageId = workbook.addImage({
            buffer: buffer,
            extension: ext, // jpg/png/webp
          });

          const rowNumber = worksheet.rowCount;

          worksheet.addImage(imageId, {
            tl: { col: 6, row: rowNumber - 1 },
            ext: { width: 80, height: 80 },
          });

          worksheet.getRow(rowNumber).height = 60;
        }
      }

      // Export file
      const buffer = await workbook.xlsx.writeBuffer();
      const today = new Date().toISOString().split("T")[0];
      saveAs(new Blob([buffer]), `Donations_${today}.xlsx`);

      setAlert({
        type: "success",
        message: "Donations exported with images successfully!",
      });
    } catch (error) {
      console.error("Excel export failed:", error);
      setAlert({
        type: "error",
        message: "Failed to export donations. Try again.",
      });
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
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
              Donations Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage and track all donations received for the foundation
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-white rounded-lg shadow-md border px-4 py-2 text-center border-[#2d365b]">
              <div className="font-bold text-gray-600 text-sm">
                Total Donation: ₹{" "}
                {Number(totalDonations).toLocaleString("en-IN")}
              </div>
            </div>
            {/* Export Button */}
            <button
              onClick={exportToExcel}
              className="group relative bg-[#2d365b] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md border border-[#2d365b] hover:bg-white hover:text-[#2d365b] transition-all duration-300 ease-in-out overflow-hidden"
            >
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faDownload}
                  className="transition-transform duration-300 group-hover:scale-110 text-xs"
                />
                <span className="text-sm">Export to Excel</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d365b] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="bg-[#2d365b] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1e2a4a] transition-all duration-300 flex items-center space-x-2 border border-[#2d365b] text-sm whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faFilter} className="text-xs" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Donor Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDonations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{donation.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#2d365b]">
                        {donation.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        ₹{donation.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {donation.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {donation.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {donation.receipt_path ? (
                        <img
                          src={`${base_url}public/${donation.receipt_path}`}
                          alt="Receipt"
                          onClick={() =>
                            setSelectedImage(
                              `${base_url}public/${donation.receipt_path}`
                            )
                          }
                          className="w-12 h-12 rounded-lg object-cover cursor-pointer border hover:scale-110 transition"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          No receipt
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredDonations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="text-5xl mb-4 text-[#2d365b]">💰</div>
            <h3 className="text-xl font-bold text-[#2d365b] mb-3">
              No Donations Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              No donation records match your search criteria. Try adjusting your
              filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#2d365b] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:text-[#2d365b] border border-[#2d365b] transition-all duration-300 text-sm"
            >
              Clear Filters
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

        {selectedImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            {/* MODAL BOX */}
            <div
              className="relative bg-white rounded-xl shadow-2xl 
                    w-[90vw] max-w-[900px] h-[85vh] flex flex-col overflow-hidden"
            >
              {/* FIXED CLOSE BUTTON */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-[#2d365b] text-white 
                   w-10 h-10 flex items-center justify-center 
                   rounded-full shadow-lg hover:bg-[#1e2a4a] transition"
              >
                ✕
              </button>

              {/* IMAGE WRAPPER (FIXED SIZE) */}
              <div className="flex-1 w-full h-full p-4 flex items-center justify-center">
                {/* IMAGE WITH FIXED SIZE + OBJECT-FIT COVER */}
                <div className="w-full h-full max-h-[80vh] max-w-[850px] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={selectedImage}
                    alt="Receipt"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div
            ref={filterRef}
            className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md animate-scale-in p-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
              <h3 className="text-lg font-bold text-[#2d365b]">
                Filter Donations
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Date Range Filters */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d365b] focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d365b] focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 bg-[#2d365b] text-white py-3 rounded-lg font-semibold hover:bg-[#1e2a4a] transition-all duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
