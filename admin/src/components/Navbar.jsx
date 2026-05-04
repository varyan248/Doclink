import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { Moon, Sun } from 'lucide-react'

const Navbar = () => {


  const {aToken, setAToken} = useContext(AdminContext)
  const {dToken, setDToken} = useContext(DoctorContext) 

  const navigate = useNavigate()
  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }

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

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300'>
      <div className='flex items-center gap-3 text-xs '> 
        <img className='w-15 sm:w-40 cursor-pointer hover:scale-105 transition-transform' src={assets.admin_logo} alt="Doclink Admin" />
        <p className='border border-blue-200 bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium tracking-wide shadow-sm'>
  {
    dToken 
      ? 'Doctor Panel' 
      : aToken 
      ? 'Admin Panel' 
      : ''
  }
</p>

      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
        <button 
          onClick={logout} 
          className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm px-8 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer'
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Navbar
