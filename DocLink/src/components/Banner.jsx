import React from "react";
import assets from "../assets/asset.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl px-6 sm:px-10 md:px-12 lg:px-14 my-20 md:mx-10 shadow-2xl relative overflow-hidden"
    >
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-white opacity-[0.05] rounded-full rotate-45 blur-3xl"></div>
        <div className="absolute bottom-[-50%] left-[-10%] w-[50%] h-[150%] bg-blue-400 opacity-[0.1] rounded-full -rotate-45 blur-3xl"></div>
      </div>

      {/* ----- LEFT SIDE ------ */}
      <div className="flex-1 py-10 sm:py-12 md:py-16 lg:py-24 lg:pl-5 z-10 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg"
        >
          <p>Book Appointment</p>
          <p className="mt-4 text-blue-100">With 100% Trusted Doctors</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={()=> {navigate('/login'); scrollTo(0,0) }} 
          className="group flex items-center w-max gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-full mt-8 hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Create Account
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
      
      {/* ----- RIGHT SIDE ------ */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden md:block md:w-1/2 lg:w-[370px] relative z-10" 
      >
        <img 
          className="w-full absolute bottom-0 right-0 max-w-md drop-shadow-2xl" 
          src={assets.appointment} 
          alt="Book Appointment" 
          style={{ maskImage: "linear-gradient(to top, black 90%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 90%, transparent 100%)" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;
