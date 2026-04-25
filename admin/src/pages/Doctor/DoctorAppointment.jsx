import React, { useState, useMemo, useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { assets } from "../../assets/assets.js";

const DoctorAppointment = () => {
  const {
    dToken,
    setDToken,
    appointment,
    getAppointment,
    calculateAge,
    cancelAppointment,
    completeAppointment,
    addPrescription,
  } = useContext(DoctorContext);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Prescription modal state
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionAppointment, setPrescriptionAppointment] = useState(null);
  const [advice, setAdvice] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View prescription modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAppointment, setViewAppointment] = useState(null);

  // Set token once
  useEffect(() => {
    if (!dToken) {
      setDToken(localStorage.getItem("dToken"));
    }
  }, []);

  // Fetch data when token is ready
  useEffect(() => {
    if (dToken) {
      getAppointment();
    }
  }, [dToken]);

  // ── Filter appointments by search + date ──
  const filteredAppointments = useMemo(() => {
    if (!appointment) return [];

    return appointment.filter((item) => {
      const patientName = item.userData?.name?.toLowerCase() || "";
      const query = search.toLowerCase().trim();

      const matchesSearch = !query || patientName.includes(query);

      let matchesDate = true;
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        const formattedSelected = `${parseInt(day)}-${parseInt(month)}-${year}`;
        matchesDate = item.slotDate === formattedSelected;
      }

      return matchesSearch && matchesDate;
    });
  }, [appointment, search, selectedDate]);

  const getPaymentLabel = (item) => {
    if (!item.payment) {
      return {
        text: "CASH",
        color: "text-yellow-600 bg-yellow-50 border-yellow-300",
      };
    }
    switch (item.paymentMethod) {
      case "gpay":
        return { text: "GPay", color: "text-blue-600 bg-blue-50 border-blue-300" };
      case "credit_card":
        return { text: "Credit Card", color: "text-purple-600 bg-purple-50 border-purple-300" };
      case "debit_card":
        return { text: "Debit Card", color: "text-emerald-600 bg-emerald-50 border-emerald-300" };
      default:
        return { text: "ONLINE", color: "text-green-600 bg-green-50 border-green-300" };
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDate("");
  };

  // ── Prescription Modal Functions ──
  const openPrescriptionModal = (item) => {
    setPrescriptionAppointment(item);
    setAdvice("");
    setNotes("");
    setMedicines([{ name: "", dosage: "", duration: "" }]);
    setShowPrescriptionModal(true);
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setPrescriptionAppointment(null);
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmitPrescription = async () => {
    if (!advice.trim()) {
      return;
    }

    const validMedicines = medicines.filter((m) => m.name.trim());

    setIsSubmitting(true);
    const result = await addPrescription(
      prescriptionAppointment._id,
      advice,
      validMedicines,
      notes
    );
    setIsSubmitting(false);

    if (result.success) {
      closePrescriptionModal();
    }
  };

  // ── View Prescription ──
  const openViewModal = (item) => {
    setViewAppointment(item);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewAppointment(null);
  };

  const hasPrescription = (item) => {
    return item.prescription && item.prescription.advice && item.prescription.advice.trim() !== '';
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">My Appointments</p>

      {/* ══════════ Search & Date Filter Bar ══════════ */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
            {filteredAppointments.length} result{filteredAppointments.length !== 1 ? "s" : ""}
          </span>
          {(search || selectedDate) && (
            <button onClick={clearFilters} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg border border-red-200 hover:bg-red-100 transition-all text-sm font-medium whitespace-nowrap">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ══════════ Appointments Table ══════════ */}
      <div className="bg-white border rounded-lg text-sm max-h-[80vh] min-h-[50vh] overflow-hidden shadow-sm">
        <div className="max:sm-hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_2.5fr_1fr_1fr_1.2fr] gap-1 py-3 px-6 border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
          <p>Prescription</p>
        </div>

        <div className="overflow-y-auto max-h-[70vh]">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">No appointments found</p>
              <p className="text-xs mt-1">Try adjusting your search or date filter</p>
            </div>
          ) : (
            filteredAppointments.map((item, index) => {
              const paymentInfo = getPaymentLabel(item);
              return (
                <div
                  className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2.5fr_1fr_1fr_1.2fr] gap-1 items-center py-3 px-6 text-gray-500 border-b hover:bg-blue-50/30 transition-colors"
                  key={item._id || index}
                >
                  <p className="max-sm:hidden">{index + 1}</p>
                  <div className="flex items-center gap-2">
                    <img className="w-10 rounded-full" src={item.userData?.image} alt="" />
                    <p>{item.userData?.name}</p>
                  </div>
                  <div>
                    <span className={`text-xs inline-block px-2.5 py-1 rounded-full border font-medium ${paymentInfo.color}`}>
                      {paymentInfo.text}
                    </span>
                  </div>
                  <p className="max-sm:hidden">{calculateAge(item.userData?.dob)}</p>
                  <p>{item.slotDate}, {item.slotTime}</p>
                  <p>₹{item.amount}</p>

                  {/* Action */}
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">Completed</p>
                  ) : (
                    <div className="flex">
                      <img onClick={() => cancelAppointment(item._id)} className="w-10 cursor-pointer hover:scale-110 transition-transform" src={assets.cancel_icon} alt="Cancel" />
                      <img onClick={() => completeAppointment(item._id)} className="w-10 cursor-pointer hover:scale-110 transition-transform" src={assets.tick_icon} alt="Complete" />
                    </div>
                  )}

                  {/* Prescription Button */}
                  <div>
                    {hasPrescription(item) ? (
                      <button
                        onClick={() => openViewModal(item)}
                        className="text-xs px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-full font-medium hover:bg-green-100 transition-all cursor-pointer"
                      >
                        📋 View
                      </button>
                    ) : !item.cancelled ? (
                      <button
                        onClick={() => openPrescriptionModal(item)}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-medium hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        ✏️ Write
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ══════════ WRITE PRESCRIPTION MODAL ══════════ */}
      {showPrescriptionModal && prescriptionAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" style={{ animation: "prescriptionModalIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-100">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-t-2xl"></div>
              <button
                onClick={closePrescriptionModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Write Prescription
              </h2>

              {/* Patient Info */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl flex items-center gap-3">
                <img
                  src={prescriptionAppointment.userData?.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{prescriptionAppointment.userData?.name}</p>
                  <p className="text-xs text-gray-500">
                    {prescriptionAppointment.slotDate} | {prescriptionAppointment.slotTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              {/* Advice */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Doctor's Advice <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  rows="3"
                  placeholder="e.g. Take rest for 3 days, drink plenty of water..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Medicines</label>
                  <button
                    onClick={addMedicineRow}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition-all cursor-pointer border border-blue-200"
                  >
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Medicine name"
                          value={med.name}
                          onChange={(e) => updateMedicine(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      {medicines.length > 1 && (
                        <button
                          onClick={() => removeMedicineRow(index)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-all cursor-pointer mt-0.5"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  placeholder="Any additional notes or follow-up instructions..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitPrescription}
                disabled={isSubmitting || !advice.trim()}
                className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                  ${isSubmitting || !advice.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-teal-500 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.416" strokeDashoffset="10" strokeLinecap="round" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Prescription
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ VIEW PRESCRIPTION MODAL ══════════ */}
      {showViewModal && viewAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative" style={{ animation: "prescriptionModalIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="relative p-6 pb-4 border-b border-gray-100">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 rounded-t-2xl"></div>
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                📋 Prescription Details
              </h2>

              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl flex items-center gap-3">
                <img src={viewAppointment.userData?.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{viewAppointment.userData?.name}</p>
                  <p className="text-xs text-gray-500">{viewAppointment.slotDate} | {viewAppointment.slotTime}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Advice */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Doctor's Advice</p>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-xl border border-blue-100">
                  {viewAppointment.prescription?.advice || "No advice given"}
                </p>
              </div>

              {/* Medicines */}
              {viewAppointment.prescription?.medicines?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Medicines</p>
                  <div className="space-y-2">
                    {viewAppointment.prescription.medicines.map((med, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{med.name}</p>
                          <p className="text-xs text-gray-500">
                            {med.dosage && `Dosage: ${med.dosage}`}
                            {med.dosage && med.duration && " • "}
                            {med.duration && `Duration: ${med.duration}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewAppointment.prescription?.notes && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Additional Notes</p>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                    {viewAppointment.prescription.notes}
                  </p>
                </div>
              )}

              {/* Prescribed date */}
              {viewAppointment.prescription?.prescribedAt && (
                <p className="text-xs text-gray-400 text-center">
                  Prescribed on: {new Date(viewAppointment.prescription.prescribedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes prescriptionModalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DoctorAppointment;
