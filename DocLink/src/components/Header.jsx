import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Header = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl px-6 md:px-10 lg:px-20 mt-4 shadow-2xl overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* {------ left side -------} */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 m-auto md:py-[10vw] md:mb-[-30px] z-10">
        <motion.p 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight md:leading-tight lg:leading-tight drop-shadow-lg"
        >
          Book appointments <br />
          <span className="text-blue-100">With trusted Doctors</span>
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-3 text-white text-base font-light"
        >
          <p>Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block"/> schedule your appointment hassle-free.</p>
        </motion.div>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-4 text-blue-600 font-semibold text-sm m-auto md:m-0 hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-full group"
        >
          Book Appointments 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </div>

      {/* {----- Right side -------} */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative md:w-1/2 flex justify-center items-end"
      >
        <img
          className="w-full md:absolute max-w-md h-auto bottom-0 rounded-lg drop-shadow-2xl z-10"
          src="https://assets.medpagetoday.net/media/images/101xxx/101506.jpg"
          alt="Trusted Doctors"
          style={{ maskImage: "linear-gradient(to top, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 80%, transparent 100%)" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Header;
