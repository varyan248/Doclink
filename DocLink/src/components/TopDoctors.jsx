import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-800 md:mx-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Top Doctors To Book
        </h1>
        <p className="sm:w-2/3 lg:w-1/2 mx-auto text-center text-gray-500 text-base">
          Simply browse through our extensive list of trusted, award-winning doctors.
        </p>
      </motion.div>

      {/* Updated Grid Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="w-full flex flex-wrap gap-8 justify-center pt-8 px-3 sm:px-0"
      >
        {doctors.slice(0, 10).map((item, index) => (
          <motion.div
            variants={cardVariants}
            onClick={() => {navigate(`/myAppointments/${item._id}`); scrollTo(0,0) }}
            key={index}
            className="w-64 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="relative overflow-hidden bg-blue-50">
              <img
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                src={item.image}
                alt={item.name}
              />
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1 rounded-full text-yellow-500 shadow-sm">
                <Star className="w-4 h-4 fill-yellow-500" />
              </div>
            </div>

            <div className="p-5 space-y-2 relative">
              <div className={`flex items-center gap-2 text-sm font-medium ${item.available ? "text-green-500" : "text-gray-400"} `}>
                <span className={`relative flex h-2.5 w-2.5`}>
                  {item.available && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </span>
                {item.available ? 'Available' : "Not Available"}
              </div>

              <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.name}</p>
              <p className="text-sm text-gray-500 bg-gray-50 w-max px-3 py-1 rounded-md">{item.speciality}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 px-12 py-4 rounded-full mt-12 font-semibold shadow-sm hover:shadow-md transition-all"
        onClick={() => {
          navigate("/Doctors");
          window.scrollTo(0, 0)
        }}
      >
        More Doctors
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
};

export default TopDoctors;
