import React, { useState, useMemo, useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const {
    setDashData,
    dashData,
    getDashData,
    dToken,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  // ── Filter latest appointments by search + date ──
  const filteredAppointments = useMemo(() => {
    if (!dashData || !dashData.latestAppointments) return [];

    return dashData.latestAppointments.filter((item) => {
      const patientName = item.userData?.name?.toLowerCase() || "";
      const query = search.toLowerCase().trim();

      const matchesSearch = !query || patientName.includes(query);

      // Handle date comparison — slotDate is stored as "24-4-2026" format (D-M-YYYY)
      let matchesDate = true;
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        const formattedSelected = `${parseInt(day)}-${parseInt(month)}-${year}`;
        matchesDate = item.slotDate === formattedSelected;
      }

      return matchesSearch && matchesDate;
    });
  }, [dashData, search, selectedDate]);

  const getPaymentLabel = (item) => {
    if (!item.payment) {
      return {
        text: "Pending",
        color: "text-yellow-600 bg-yellow-50 border-yellow-300",
      };
    }
    switch (item.paymentMethod) {
      case "gpay":
        return {
          text: "GPay",
          color: "text-blue-600 bg-blue-50 border-blue-300",
        };
      case "credit_card":
        return {
          text: "Credit Card",
          color: "text-purple-600 bg-purple-50 border-purple-300",
        };
      case "debit_card":
        return {
          text: "Debit Card",
          color: "text-emerald-600 bg-emerald-50 border-emerald-300",
        };
      default:
        return {
          text: "Online",
          color: "text-green-600 bg-green-50 border-green-300",
        };
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDate("");
  };

  return (
    dashData && (
      <div className="m-5 w-full">
        {/* ══════════ Stat Cards ══════════ */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-500">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                ₹ {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-500">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-500">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        {/* ══════════ Search & Date Filter Bar ══════════ */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
            />
          </div>

          {/* Date Picker */}
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm cursor-pointer"
            />
          </div>

          {/* Clear Filters Button */}
          {(search || selectedDate) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 bg-red-50 text-red-500 rounded-lg border border-red-200 hover:bg-red-100 transition-all text-sm font-medium whitespace-nowrap"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ══════════ Latest Bookings ══════════ */}
        <div className="bg-white mt-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2.5">
              <img src={assets.list_icon} alt="" />
              <p className="font-semibold text-gray-700">My Patient Bookings</p>
            </div>
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
              {filteredAppointments.length} result
              {filteredAppointments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Table Header ── */}
          <div className="hidden sm:grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1.5fr] px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <p>Patient</p>
            <p>Date</p>
            <p>Time</p>
            <p>Payment</p>
            <p className="text-center">Action</p>
          </div>

          {/* ── Table Body ── */}
          <div className="max-h-[50vh] overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg
                  className="w-12 h-12 mb-3 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium">No appointments found</p>
                <p className="text-xs mt-1">
                  Try adjusting your search or date filter
                </p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => {
                const paymentInfo = getPaymentLabel(item);
                return (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1.5fr] items-center px-6 py-3.5 gap-2 sm:gap-3 border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                    key={item._id || index}
                  >
                    {/* Patient */}
                    <div className="flex items-center gap-3">
                      <img
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                        src={item.userData?.image}
                        alt=""
                      />
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {item.userData?.name || "N/A"}
                      </p>
                    </div>

                    {/* Date */}
                    <p className="text-sm text-gray-600">{item.slotDate}</p>

                    {/* Time */}
                    <p className="text-sm text-gray-600">{item.slotTime}</p>

                    {/* Payment Badge */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium w-fit ${paymentInfo.color}`}
                    >
                      {paymentInfo.text}
                    </span>

                    {/* Action */}
                    <div className="flex justify-center gap-2">
                      {item.cancelled ? (
                        <p className="text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
                          Cancelled
                        </p>
                      ) : item.isCompleted ? (
                        <p className="text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                          Completed
                        </p>
                      ) : (
                        <div className="flex gap-1">
                          <img
                            onClick={() => cancelAppointment(item._id)}
                            className="w-10 cursor-pointer hover:scale-110 transition-transform"
                            src={assets.cancel_icon}
                            alt="Cancel"
                            title="Cancel Appointment"
                          />
                          <img
                            onClick={() => completeAppointment(item._id)}
                            className="w-10 cursor-pointer hover:scale-110 transition-transform"
                            src={assets.tick_icon}
                            alt="Complete"
                            title="Mark as Completed"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
