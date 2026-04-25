import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

export const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointment, setAppointment] = useState([]);
  const [profileData, setProfileData] = useState(false);
  const [dashData, setDashData] = useState(false);

  // Fetch only this doctor's appointments (backend filters by token)
  const getAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-appointment",
        { headers: { dtoken: dToken } }
      );

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

  // Mark appointment as completed
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
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Cancel appointment
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
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Add prescription to an appointment
  const addPrescription = async (appointmentId, advice, medicines, notes) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/add-prescription",
        { appointmentId, advice, medicines, notes },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
        getDashData();
      } else {
        toast.error(data.message);
      }
      return data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return { success: false };
    }
  };

  // Get dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/doctor-dashboard`,
        {
          headers: { dtoken: dToken },
        }
      );

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Get doctor profile data
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/doctor-profile`,
        {
          headers: { dtoken: dToken },
        }
      );
      if (data.success) {
        setProfileData(data.profileData);
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
    addPrescription,
    getDashData,
    setDashData,
    dashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};
