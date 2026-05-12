import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import asset from "../assets/asset";
import { AppContext } from "../context/AppContext";
import { Moon, Sun, Menu, X, ChevronRight, LogOut, User, Calendar } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [showMenu, setShowMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.body.classList.contains('dark-theme')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark-theme');
  };

  // Close mobile menu on resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showMenu]);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between py-4 px-4 sm:px-6 md:px-10 rounded-b-2xl shadow-sm backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="flex items-center gap-2">
        <img 
          onClick={() => navigate('/')} 
          className="w-24 sm:w-28 cursor-pointer hover:scale-105 transition-transform" 
          src={asset.logo} 
          alt="Doclink" 
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center font-medium gap-8">
        <NavLink to="/" className={({ isActive }) => `relative py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}>
          Home
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </NavLink>

        <NavLink to="/doctors" className={({ isActive }) => `relative py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}>
          All Doctors
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => `relative py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}>
          About
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => `relative py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}>
          Contact
        </NavLink>
      </ul>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Background Color"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {token && userData ? (
          <div className="relative group hidden sm:block">
            <div className="flex items-center cursor-pointer gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-full transition-colors">
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900 shadow-sm"
                src={userData.image}
                alt="profile"
              />
              <img
                className="w-3 h-3 object-contain transition-transform duration-300 group-hover:rotate-180"
                src={asset.icon}
                alt="dropdown"
              />
            </div>

            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-2xl py-2 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 z-50 origin-top-right">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userData.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.email}</p>
              </div>
              <button
                className="w-full text-left px-5 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300"
                onClick={() => navigate('/myProfile')}
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              <button
                className="w-full text-left px-5 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300"
                onClick={() => navigate('/myAppointments')}
              >
                <Calendar className="w-4 h-4" /> Appointments
              </button>
              <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-1"></div>
              <button
                className="w-full text-left px-5 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Sign In
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setShowMenu(true)} 
          className="md:hidden p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ----- Mobile Menu Overlay & Drawer ----- */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setShowMenu(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 z-[70] md:hidden shadow-2xl transition-transform duration-300 transform ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <img className="w-28" src={asset.logo} alt="Doclink" />
          <button 
            onClick={() => setShowMenu(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto px-6 py-8">
          {token && userData && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-8">
              <img className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800" src={userData.image} alt="" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{userData.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back!</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/doctors', label: 'All Doctors' },
              { path: '/about', label: 'About Us' },
              { path: '/contact', label: 'Contact Us' }
            ].map((item) => (
              <NavLink 
                key={item.path}
                onClick={() => setShowMenu(false)} 
                to={item.path}
                className={({ isActive }) => `flex items-center justify-between p-4 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <span className="font-medium uppercase tracking-wider">{item.label}</span>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-8 flex flex-col gap-4">
            {!token ? (
              <button
                onClick={() => { navigate("/login"); setShowMenu(false); }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all"
              >
                Get Started
              </button>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                   <button onClick={() => { navigate('/myProfile'); setShowMenu(false); }} className="flex items-center gap-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                     <User className="w-5 h-5" /> My Profile
                   </button>
                   <button onClick={() => { navigate('/myAppointments'); setShowMenu(false); }} className="flex items-center gap-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                     <Calendar className="w-5 h-5" /> Appointments
                   </button>
                </div>
                <button
                  className="w-full mt-4 flex items-center justify-center gap-2 p-4 text-red-500 font-bold border-2 border-red-50 dark:border-red-900/20 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5" /> LOGOUT
                </button>
              </>
            )}
            
            <div className="flex items-center justify-between p-4 mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dark Mode</span>
              <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDark ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

