import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import asset from "../assets/asset";
import { AppContext } from "../context/AppContext";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const {token, setToken, userData} = useContext(AppContext)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  const [showMenu, setshowMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user already had dark mode set
    if (document.body.classList.contains('dark-theme')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark-theme');
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 md:px-10 rounded-b-2xl shadow-sm backdrop-blur-md bg-white/80 border-b border-gray-100 transition-all duration-300">
      <img onClick={() => navigate('/')} className="w-28 cursor-pointer hover:scale-105 transition-transform" src={asset.logo} alt="Doclink" />
      <ul className="hidden md:flex items-start font-medium gap-8">
        <NavLink to="/">
          <li className="py-1 text-gray-700 hover:text-blue-600 transition-colors">Home</li>
          <hr className="border-none h-[2px] bg-blue-600 w-3/5 mx-auto hidden" />
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1 text-gray-700 hover:text-blue-600 transition-colors">All Doctors</li>
          <hr className="border-none h-[2px] bg-blue-600 w-3/5 mx-auto hidden" />
        </NavLink>

        <NavLink to="/about">
          <li className="py-1 text-gray-700 hover:text-blue-600 transition-colors">About</li>
          <hr className="border-none h-[2px] bg-blue-600 w-3/5 mx-auto hidden" />
        </NavLink>

        <NavLink to="/contact">
          <li className="py-1 text-gray-700 hover:text-blue-600 transition-colors">Contact</li>
          <hr className="border-none h-[2px] bg-blue-600 w-3/5 mx-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Toggle Background Color"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {token && userData ? (
          <div className="relative group">
            {/* Profile Section (always visible) */}
            <div className="flex items-center cursor-pointer gap-3 hover:bg-gray-50 p-2 rounded-full transition-colors">
              <img
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                src={userData.image}
                alt="profile"
              />
              <img
                className="w-5 h-5 object-contain transition-transform duration-300 group-hover:rotate-180"
                onClick={() => setshowMenu(true)}
                src={asset.icon}
                alt="dropdown"
              />
            </div>

            {/* Dropdown */}
            <div
              className="absolute top-16 right-0 w-48 bg-white/90 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl py-3 
        opacity-0 scale-95 invisible
        group-hover:opacity-100 group-hover:scale-100 group-hover:visible
        transition-all duration-300 z-50 origin-top-right
    "
            >
              <p
                className="px-5 py-2.5 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer text-gray-600 font-medium"
                onClick={() =>navigate('myProfile')}
              >
                My Profile
              </p>

              <p
                className="px-5 py-2.5 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer text-gray-600 font-medium"
                onClick={() =>navigate('myAppointments')}
              >
                My Appointments
              </p>

              <div className="h-[1px] bg-gray-100 my-1 mx-3"></div>

              <p
                className="px-5 py-2.5 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors cursor-pointer font-medium"
                onClick={logout}
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Create Account
          </button>
        )}
        <img onClick={() => setshowMenu(true)} className="w-8 md:hidden cursor-pointer" src={asset.menu_icon}/>
        {/* -----Mobile Menu ---- */}
        <div className={`${ showMenu ? 'fixed w-full' : 'h-0 w-0' } md:hidden right-0 top-0 bottom-0 z-50 overflow-hidden bg-white/95 backdrop-blur-lg transition-all duration-300`}>
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <img className="w-32" src={asset.logo} alt="" />
            <div className="flex gap-4 items-center">
              <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100">
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <img className="w-8 cursor-pointer p-1 bg-gray-100 rounded-full" onClick={() => setshowMenu(false)} src={asset.cross_icon} alt="" />
            </div>
          </div>
          <ul className="flex flex-col items-start gap-4 mt-8 px-8 text-xl font-medium text-gray-800" >
            <NavLink onClick={() => setshowMenu(false)} to='/'><p className='hover:text-blue-600 transition-colors'>HOME</p></NavLink>
            <NavLink onClick={() => setshowMenu(false)} to='/doctors'><p className='hover:text-blue-600 transition-colors'>ALL DOCTORS</p></NavLink> 
            <NavLink onClick={() => setshowMenu(false)} to='/about'><p className='hover:text-blue-600 transition-colors'>ABOUT US</p></NavLink >
            <NavLink onClick={() => setshowMenu(false)} to='/contact'><p className='hover:text-blue-600 transition-colors'>CONTACT US</p></NavLink >
            {!token && (
              <button
                onClick={() => {navigate("/login"); setshowMenu(false)}}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Create Account
              </button>
            )}
            {token && (
              <>
                <div className="h-[1px] bg-gray-200 w-full my-4"></div>
                <NavLink onClick={() => setshowMenu(false)} to="/myProfile">
                  <p className="hover:text-blue-600 transition-colors">MY PROFILE</p>
                </NavLink>

                <NavLink onClick={() => setshowMenu(false)} to="/myAppointments">
                  <p className="hover:text-blue-600 transition-colors">MY APPOINTMENTS</p>
                </NavLink>

                <p
                  className="text-red-500 mt-4 cursor-pointer hover:text-red-600 transition-colors"
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
