import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

export const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendUrl);
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointment, setAppointment] = useState([]);
  const [profileData, setProfileData] = useState(false);
  const [dashData, setDashData] = useState(false);

  const getAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-appointment",
        { headers: { dtoken: dToken } }
      );

      console.log("doctor appointment response:", data);

      if (data.success) {
        setAppointment(
          Array.isArray(data.appointments)
            ? [...data.appointments].reverse()
            : []
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;

    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // const getDashData = async (req, res) => {
  //   try {
  //     const docId = localStorage.getItem("docId");
  //     const { data } = await axios.get(
  //       backendUrl + "/api/doctor/doctor-dashboard",
  //       docId,
  //       { headers: { dtoken: dToken }, params: { docId } }
  //     );
  //     if (data.success) {
  //       setDashData(data.dashData);
  //       console.log(data.dashData);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

const getDashData = async () => {
  try {
    const { data } = await axios.get(
      `${backendUrl}/api/doctor/doctor-dashboard`,
      {
        headers: { dtoken: dToken }
      }
    );

    if (data.success) {
      setDashData(data.dashData);
      console.log(data.dashData);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

const getProfileData = async () => {
  try {
     const { data } = await axios.get(
      `${backendUrl}/api/doctor/doctor-profile`,
      {
        headers: { dtoken: dToken }
      }
    );
 if (data.success) {
      setProfileData(data.profileData);
      console.log(data.profileData);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointment,
    setAppointment,
    getAppointment,
    calculateAge,
    completeAppointment,
    cancelAppointment,
    getDashData,
    setDashData,
    dashData,
    profileData,
    setProfileData,
    getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};


