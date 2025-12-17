import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  // const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDoInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    //Getting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currDate = new Date(today);
      currDate.setDate(today.getDate() + i);

      //setting end time of the day with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      //Setting hours
      if (today.getDate() === currDate.getDate()) {
        const hour = currDate.getHours();
        currDate.setHours(hour > 10 ? hour + 1 : 10);

        const min = currDate.getMinutes();
        currDate.setMinutes(min > 30 ? 30 : 0);
      } else {
        currDate.setHours(10);
        currDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currDate < endTime) {
        let formatedTime = currDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currDate.getDate();
        let month = currDate.getMonth() + 1;
        let year = currDate.getFullYear();

        let slotDay = day + "-" + month + "-" + year;
        const slotTime = formatedTime;

        const isBooked =
          docInfo?.selectedSlot?.[slotDay]?.includes(formatedTime);

        if (!isBooked) {
          timeSlots.push({
            dateTime: new Date(currDate),
            time: formatedTime,
          });
        }

        //increment time by 30 minutes
        currDate.setMinutes(currDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      return toast.warn("Please select a time slot");
    }

    try {
      const selectedSlot = docSlots[slotIndex].find(
        (slot) => slot.time === slotTime
      );

      if (!selectedSlot) {
        return toast.error("Invalid slot selected");
      }

      const date = selectedSlot.dateTime;
      const slotDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;

      console.log("Booking:", {
        docId,
        slotDate,
        slotTime,
      });

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        // getDoctorsData()
        getDoctorsData();
        setSlotTime(""); // reset selected time
        fetchDoInfo(); // update selected doctor info
        getAvailableSlots(); // re-filter available slots
        navigate("/myAppointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchDoInfo();
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);
  return (
    docInfo && (
      <div className="mt-3">
        {/* -----  DOCTOR DETAILS -----  */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img src={docInfo?.image} alt="" />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg px-8 py-7 bg-white mx-2 sm:mx-0 mt-[-70px] sm:mt-0">
            {/* -----DOC INFO : name, degree, experince----- */}
            <p
              className="  flex-1 
                    border border-gray-300 
                    rounded-xl 
                    bg-white 
                    p-6 sm:p-8 
                    mx-2 
                    sm:mx-0 
                    -mt-10 sm:mt-0
                    shadow-md  "
            >
              {docInfo.name}
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="text-xs py-0.5 px-2 border rounded-full">
                {docInfo.experience}
              </button>
            </div>
            {/* ---- DOC ABOUT ------ */}
            <div>
              <p className="flex items-center gap-1 text-xl font-medium text-gray-900 mt-3 ">
                ABOUT :-{" "}
              </p>
              <p className="text-sm text-gray-600 max-w-[-700px] mt-1">
                {" "}
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4 ">
              Appointment Fees :{" "}
              <span className="text-gray-600">
                {" "}
                {currencySymbol} {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ----- BOOKING SLOT -----  */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`flex flex-col items-center justify-center
          w-20 h-20 rounded-full cursor-pointer transition-all duration-200
          ${
            slotIndex === index
              ? "bg-blue-500 text-white"
              : "border border-gray-300 hover:bg-blue-50"
          }
        `}
                >
                  {item.length > 0 && (
                    <>
                      <p className="text-sm font-medium">
                        {daysOfWeek[item[0].dateTime.getDay()]}
                      </p>
                      <p className="text-lg font-semibold">
                        {item[0].dateTime.getDate()}
                      </p>
                    </>
                  )}
                </div>
              ))}
          </div>
          <div className="flex items-center w-full gap-3 mt-4 overflow-x-scroll ">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-blue-300 text-white"
                      : "text-gray-400  border border-gray-300"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-blue-400 text-white cursor-pointer text-sm font-light px-14 rounded-full py-3 my-6 "
          >
            Book an Appointment
          </button>
        </div>
        {/* ---- LISTING RELATED DOCTORS---- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
