import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import asset from "../assets/asset";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const {token, setToken, userData} = useContext(AppContext)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  const [showMenu, setshowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-xl shadow-lg">
      <img onClick={() => navigate('/')} className="w-24 cursor-pointer " src={asset.logo} alt="" />
      <ul className="hidden md:flex items-start font-medium gap-6">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="border-none h-[2px] bg-gray-600 w-3/5 mx-auto hidden" />
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className="border-none h-[2px] bg-gray-600 w-3/5 mx-auto hidden" />
        </NavLink>

        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="border-none h-[2px] bg-gray-600 w-3/5 mx-auto hidden" />
        </NavLink>

        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="border-none h-[2px] bg-gray-600 w-3/5 mx-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex item-center gp-4">
        {token && userData ? (
          <div className="relative group">
            {/* Profile Section (always visible) */}
            <div className="flex items-center cursor-pointer gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover border"
                src={userData.image}
                alt="profile"
              />
              <img
                className="w-5 h-5 object-contain transition group-hover:rotate-180"
                onClick={() => setshowMenu(true)}
                src={asset.icon}
                alt="dropdown"
              />
            </div>

            {/* Dropdown */}
            <div
              className="
        absolute top-14 right-0 w-48 bg-white shadow-xl rounded-xl py-3 
        opacity-0 scale-95 invisible
        group-hover:opacity-100 group-hover:scale-100 group-hover:visible
        transition-all duration-200 z-50
    "
            >
              <p
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() =>navigate('myProfile')}
              >
                My Profile
              </p>

              <p
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() =>navigate('myAppointments')}
              >
                My Appointments
              </p>

              <p
                className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer rounded"
                onClick={logout}
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-blue-700"
          >
            Create Account
          </button>
        )}
        <img onClick={() => setshowMenu(true)} className="w-6 md:hidden" src={asset.menu_icon}/>
        {/* -----Mobile Menu ---- */}
        <div className={`${ showMenu ? 'fixed w-full' : 'h-0 w-0' } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className="flex item-ceter justify-between px-5 py-6">
            <img className="w-36" src={asset.logo} alt="" />
            <img className="w-7" onClick={() => setshowMenu(false)} src={asset.cross_icon} alt="" />
          </div>
          <ul className="flex flex-col item-center gap-2 mt-5 px-5 text-lg font-medium  " >
            <NavLink  onClick={() => setshowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block '>HOME</p></NavLink>
            <NavLink  onClick={() => setshowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block '>ALL DOCTORS</p></NavLink> 
            <NavLink  onClick={() => setshowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block '>ABOUT US</p></NavLink >
            <NavLink  onClick={() => setshowMenu(false)} to='/contact'> <p className='px-4 py-2 rounded inline-block '>CONTACT US</p></NavLink >
            {token && (
      <>
        <NavLink onClick={() => setshowMenu(false)} to="/myProfile">
          <p className="px-4 py-2">MY PROFILE</p>
        </NavLink>

        <NavLink onClick={() => setshowMenu(false)} to="/myAppointments">
          <p className="px-4 py-2">MY APPOINTMENTS</p>
        </NavLink>

        <p
          className="px-4 py-2 text-red-500 cursor-pointer"
          onClick={() => {
            setToken(false);
            setshowMenu(false);
          }}
        >
          LOGOUT
        </p>
      </>
    )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
