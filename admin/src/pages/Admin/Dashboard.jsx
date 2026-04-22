import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { dashData, getDashData, aToken, cancelAppointments } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const getPaymentLabel = (item) => {
    if (!item.payment) {
      return { text: 'Pending', color: 'text-yellow-600 bg-yellow-50 border-yellow-300' }
    }
    switch (item.paymentMethod) {
      case 'gpay':
        return { text: 'GPay', color: 'text-blue-600 bg-blue-50 border-blue-300' }
      case 'credit_card':
        return { text: 'Credit Card', color: 'text-purple-600 bg-purple-50 border-purple-300' }
      case 'debit_card':
        return { text: 'Debit Card', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' }
      default:
        return { text: 'Online', color: 'text-green-600 bg-green-50 border-green-300' }
    }
  }

  return (
    dashData && (
      <div className="m-5 ">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-500">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {" "}
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
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
          {/* Earnings Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-green-100 cursor-pointer hover:scale-105 transition-all duration-500">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-green-600">
                ₹{dashData.earnings || 0}
              </p>
              <p className="text-gray-400">Total Earnings</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-100">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Booking</p>
          </div>
          <div className="pt-4 border-white border-t-0 ">
            {dashData.latestAppointments.map((item, index) => {
              const paymentInfo = getPaymentLabel(item)
              return (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 "
                key={index}
              >
                <img
                  className="w-10 rounded-full"
                  src={item.docData.image}
                  alt=""
                />
                <div className="flex-1 text-sm ">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">{item.slotDate}</p>
                </div>
                {/* Payment Badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${paymentInfo.color}`}>
                  {paymentInfo.text}
                </span>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <img
                    onClick={() => cancelAppointments(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            )})}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
