import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white/60 backdrop-blur-xl border-r border-gray-100 shadow-sm">
      {aToken && (
        <ul className="text-[#515151] mt-6 flex flex-col gap-2 px-4">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="" className="w-5" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/all-apointments"}
          >
            <img src={assets.appointment_icon} alt="" className="w-5" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/add-doctor"}
          >
            <img src={assets.add_icon} alt="" className="w-5" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/doctorList"}
          >
            <img src={assets.people_icon} alt="" className="w-5" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-6 flex flex-col gap-2 px-4">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/doctor-dashboard"}
          >
            <img src={assets.home_icon} alt="" className="w-5" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/doctor-appointment"}
          >
            <img src={assets.appointment_icon} alt="" className="w-5" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 py-3.5 px-4 md:px-6 md:min-w-64 cursor-pointer rounded-xl transition-all duration-300 ${
                isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm text-blue-700 font-medium" : "hover:bg-gray-50/80 hover:translate-x-1"
              }`
            }
            to={"/doctor-profile"}
          >
            <img src={assets.add_icon} alt="" className="w-5" />
            <p className="hidden md:block">Doctor Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
