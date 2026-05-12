import React from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar.jsx"
import Sidebar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllApointments from "./pages/Admin/AllApointments.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className="min-h-screen bg-transparent">
      <ToastContainer/>
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* -----Admin Route ----- */}
          <Route path="/" element={<></>}/>
          <Route path="/admin-dashboard" element={<Dashboard />}/>
          <Route path="/all-apointments" element={<AllApointments />}/>
          <Route path="/doctorList" element={<DoctorsList />}/>
          <Route path="/add-doctor" element={<AddDoctor />}/>

          {/* -----Doctor Route ----- */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />}/>
          <Route path="/doctor-appointment" element={<DoctorAppointment />}/>
          <Route path="/doctor-profile" element={<DoctorProfile />}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
