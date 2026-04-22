import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // GPay state
  const [upiId, setUpiId] = useState("");

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments.slice().reverse());
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openPaymentModal = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedMethod("");
    setPaymentSuccess(false);
    setIsProcessing(false);
    resetFormFields();
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedAppointment(null);
    setSelectedMethod("");
    setPaymentSuccess(false);
    resetFormFields();
  };

  const resetFormFields = () => {
    setCardNumber("");
    setCardHolder("");
    setExpiry("");
    setCvv("");
    setUpiId("");
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.warn("Please select a payment method");
      return;
    }

    let paymentDetails = {};

    if (selectedMethod === "gpay") {
      if (!upiId) {
        toast.warn("Please enter your UPI ID");
        return;
      }
      paymentDetails = { upiId };
    }

    if (selectedMethod === "credit_card" || selectedMethod === "debit_card") {
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        toast.warn("Please fill in all card details");
        return;
      }
      paymentDetails = {
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardHolder,
        expiry,
        cvv,
      };
    }

    setIsProcessing(true);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/process-payment",
        {
          appointmentId: selectedAppointment._id,
          paymentMethod: selectedMethod,
          paymentDetails,
        },
        { headers: { token } }
      );

      if (data.success) {
        setPaymentSuccess(true);
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
        setTimeout(() => {
          closePaymentModal();
        }, 2500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Payment method options configuration
  const paymentMethods = [
    {
      id: "gpay",
      name: "Google Pay",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
        </svg>
      ),
      gradient: "from-blue-500 to-green-400",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      glowColor: "shadow-blue-200",
    },
    {
      id: "credit_card",
      name: "Credit Card",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="3" ry="3" stroke="#8B5CF6"/>
          <line x1="1" y1="10" x2="23" y2="10" stroke="#8B5CF6"/>
          <line x1="5" y1="15" x2="12" y2="15" stroke="#8B5CF6" strokeWidth="1"/>
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-400",
      glowColor: "shadow-purple-200",
    },
    {
      id: "debit_card",
      name: "Debit Card",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="3" ry="3" stroke="#10B981"/>
          <line x1="1" y1="10" x2="23" y2="10" stroke="#10B981"/>
          <circle cx="18" cy="15" r="2" stroke="#10B981" strokeWidth="1"/>
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-400",
      glowColor: "shadow-emerald-200",
    },
  ];

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => {
          return (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:gap-6 sm:flex py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50 "
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600 ">
                <p className="text-neutral-800 font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2  justify-end">
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 rounded border text-stone-500 bg-indigo-50 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Paid {item.paymentMethod ? `(${item.paymentMethod === 'gpay' ? 'GPay' : item.paymentMethod === 'credit_card' ? 'Credit Card' : item.paymentMethod === 'debit_card' ? 'Debit Card' : 'Online'})` : ''}
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => openPaymentModal(item)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ PAYMENT MODAL ============ */}
      {showPaymentModal && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            style={{
              animation: "paymentModalIn 0.35s cubic-bezier(0.16,1,0.3,1)"
            }}
          >
            {/* Success Overlay */}
            {paymentSuccess && (
              <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-10" style={{ animation: "fadeIn 0.3s ease" }}>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4" style={{ animation: "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-800">Payment Successful!</p>
                <p className="text-sm text-gray-500 mt-1">Your appointment is confirmed</p>
              </div>
            )}

            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-gray-100">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
              <button
                onClick={closePaymentModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Payment
              </h2>
              <p className="text-sm text-gray-500 mt-1">Choose your preferred payment method</p>

              {/* Appointment summary */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center gap-3">
                <img
                  src={selectedAppointment.docData.image}
                  alt={selectedAppointment.docData.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{selectedAppointment.docData.name}</p>
                  <p className="text-xs text-gray-500">{selectedAppointment.slotDate} | {selectedAppointment.slotTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">₹{selectedAppointment.amount}</p>
                </div>
              </div>
            </div>

            {/* Payment Methods Selection */}
            <div className="p-6 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Select Payment Method</p>
              
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    resetFormFields();
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    ${selectedMethod === method.id 
                      ? `${method.borderColor} ${method.bgColor} shadow-lg ${method.glowColor}` 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod === method.id ? `bg-gradient-to-br ${method.gradient} shadow-md` : "bg-gray-100"}`}>
                    <div className={selectedMethod === method.id ? "text-white" : "text-gray-500"}>
                      {method.icon}
                    </div>
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-semibold ${selectedMethod === method.id ? "text-gray-800" : "text-gray-600"}`}>
                      {method.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {method.id === "gpay" && "Pay using UPI"}
                      {method.id === "credit_card" && "Visa, Mastercard, RuPay"}
                      {method.id === "debit_card" && "All bank debit cards"}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${selectedMethod === method.id ? `${method.borderColor}` : "border-gray-300"}`}
                  >
                    {selectedMethod === method.id && (
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${method.gradient}`} style={{ animation: "scaleIn 0.2s ease" }}></div>
                    )}
                  </div>
                </button>
              ))}

              {/* ---- PAYMENT FORM AREA ---- */}
              {selectedMethod && (
                <div className="mt-5 pt-5 border-t border-gray-100" style={{ animation: "slideUp 0.3s ease" }}>
                  
                  {/* GPay Form */}
                  {selectedMethod === "gpay" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Google Pay Details</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">UPI ID</label>
                        <input
                          type="text"
                          placeholder="yourname@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Credit Card / Debit Card Form */}
                  {(selectedMethod === "credit_card" || selectedMethod === "debit_card") && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedMethod === "credit_card" ? "from-purple-500 to-pink-500" : "from-emerald-500 to-teal-500"} flex items-center justify-center`}>
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          {selectedMethod === "credit_card" ? "Credit Card" : "Debit Card"} Details
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-gray-300 tracking-wider font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="JOHN DOE"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-gray-300 uppercase tracking-wide"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value.replace(/[^0-9]/g, "")))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-gray-300 font-mono tracking-wider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-gray-300 font-mono tracking-widest"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full mt-6 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                      ${isProcessing 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : selectedMethod === "gpay"
                          ? "bg-gradient-to-r from-blue-500 to-green-400 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                          : selectedMethod === "credit_card"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 active:translate-y-0"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.416" strokeDashoffset="10" strokeLinecap="round"/>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay ₹{selectedAppointment?.amount}
                      </>
                    )}
                  </button>

                  {/* Security badge */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-xs text-gray-400">Secured with 256-bit SSL encryption</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes paymentModalIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MyAppointments;
