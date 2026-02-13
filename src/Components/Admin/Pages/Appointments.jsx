import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CustomAlert from "../../CustomAlert/CustomAlert";
import base_url from "../../../Config";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const appointmentsPerPage = 10;
  const filterRef = useRef(null);

  const [hoveredAppointment, setHoveredAppointment] = useState(null);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${base_url}api/appointments`);
      setAppointments(res.data.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Search + date filter
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.contact_no.includes(searchQuery) ||
      (appt.alternate_contact_no || "").includes(searchQuery);

    const apptDate = new Date(appt.appointment_date);
    const matchesStartDate = !startDate || apptDate >= new Date(startDate);
    const matchesEndDate = !endDate || apptDate <= new Date(endDate);

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirst,
    indexOfLast
  );

  const getPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          {/* LEFT TEXT */}
          <div>
            <h1 className="text-3xl font-bold text-[#2d365b] mb-2">
              Appointments Management
            </h1>
            <p className="text-gray-600">
              View all appointments and patient concerns.
            </p>
          </div>

          {/* RIGHT — TODAY'S APPOINTMENTS BOX */}
          <div className="mt-4 lg:mt-0">
            <div className="bg-white px-6 py-3 rounded-lg shadow-md border border-[#2d365b]">
              <p className="text-sm text-gray-600 font-semibold">
                Today's Appointments :{" "}
                {
                  appointments.filter((appt) => {
                    const today = new Date().toISOString().split("T")[0];
                    return appt.appointment_date === today;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-80">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#2d365b]"
            />
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className="bg-[#2d365b] px-4 py-2 text-white rounded-lg shadow hover:bg-[#1e2a4a]"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" /> Filters
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Alternate</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Slot</th>
              </tr>
            </thead>

            <tbody>
              {currentAppointments.map((appt, index) => (
                <React.Fragment key={appt.id}>
                  <tr
                    onMouseEnter={() => setHoveredAppointment(appt.id)}
                    onMouseLeave={() => setHoveredAppointment(null)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3 font-semibold text-[#2d365b]">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="p-3 font-medium">
                      {appt.first_name} {appt.last_name}
                    </td>
                    <td className="p-3">{appt.contact_no}</td>
                    <td className="p-3">{appt.alternate_contact_no || "-"}</td>
                    <td className="p-3">{appt.email}</td>
                    <td className="p-3">{appt.age}</td>
                    <td className="p-3">{appt.gender}</td>
                    <td className="p-3">
                      {formatDate(appt.appointment_date)}
                    </td>
                    <td className="p-3">{appt.time_slot}</td>
                  </tr>

                  {/* Expanded Hover Row */}
                  {hoveredAppointment === appt.id && (
                    <tr>
                      <td colSpan="9" className="bg-[#f7f9ff] p-4 text-center">
                        <div className="text-[#2d365b] font-semibold text-sm">
                          Concerns
                        </div>
                        <div className="text-gray-700 text-sm mt-1">
                          {appt.concerns || "No concerns provided"}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* NO DATA */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No appointments found.
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-white border rounded disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {getPagination().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded border ${
                  num === currentPage
                    ? "bg-[#2d365b] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-white border rounded disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            ref={filterRef}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4">Filter Appointments</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 py-2 rounded font-medium"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 bg-[#2d365b] text-white py-2 rounded font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
