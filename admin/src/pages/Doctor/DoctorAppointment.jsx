    import React, { useEffect, useContext } from "react";
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
      } = useContext(DoctorContext);

      // Set token once
      useEffect(() => {
        if (!dToken) {
          console.log("Setting Token...");
          setDToken(localStorage.getItem("dToken"));
        }
      }, []); // run one time

      // Fetch data when token is ready
      useEffect(() => {
        console.log("Token changed:", dToken);
        if (dToken) {
          getAppointment();
        }
      }, [dToken]);

      const getPaymentLabel = (item) => {
        if (!item.payment) {
          return { text: 'CASH', color: 'text-yellow-600 bg-yellow-50 border-yellow-300' }
        }
        switch (item.paymentMethod) {
          case 'gpay':
            return { text: 'GPay', color: 'text-blue-600 bg-blue-50 border-blue-300' }
          case 'credit_card':
            return { text: 'Credit Card', color: 'text-purple-600 bg-purple-50 border-purple-300' }
          case 'debit_card':
            return { text: 'Debit Card', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' }
          default:
            return { text: 'ONLINE', color: 'text-green-600 bg-green-50 border-green-300' }
        }
      }

      return (
        <div className="w-full max-w-6xl m-5">
          <p className="mb-3 text-lg font-medium">All-Appointments</p>
          <div className="bg-white border rounded text-sm max-h-[-80vh] min-h-[50vh] overflow-y-scroll ">
            <div className="max:sm-hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
              <p>#</p>
              <p>Patient</p>
              <p>Payment</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Fees</p>
              <p>Action</p>
            </div>

            {appointment.map((item, index) => {
              const paymentInfo = getPaymentLabel(item)
              return (
              <div
                className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center py-3 px-6 text-gray-500 border-b hover:bg-gray-100"
                key={index}
              >
                <p className="max-sm:hidden">{index + 1}</p>
                <div className="flex items-center gap-2">
                  <img
                    className="w-10 rounded-full"
                    src={item.userData.image}
                    alt=""
                  />{" "}
                  <p>{item.userData.name}</p>
                </div>
                <div>
                  <span className={`text-xs inline-block px-2.5 py-1 rounded-full border font-medium ${paymentInfo.color}`}>
                    {paymentInfo.text}
                  </span>
                </div>
                <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                <p>
                  {item.slotDate}, {item.slotTime}
                </p>
                <p>₹{item.amount}</p>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium"> Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
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
      );
    };

    export default DoctorAppointment;
