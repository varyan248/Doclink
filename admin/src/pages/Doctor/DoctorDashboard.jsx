import React, { useContext, useEffect } from "react";
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
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

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
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-500">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {" "}
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
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm ">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">{item.slotDate}</p>
                </div>
                {/* Payment Badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${paymentInfo.color}`}>
                  {paymentInfo.text}
                </span>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium"> Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
