import React from "react";
import { specialityData } from "../assets/asset";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SpecialityMenu = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div
      className="flex flex-col items-center gap-6 py-20 text-gray-800"
      id="speciality"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Find by Speciality
        </h1>
        <p className="sm:w-2/3 lg:w-1/2 mx-auto text-center text-gray-500 mt-4 text-base">
          Simply browse through our extensive list of doctors and schedule your
          appointment hassle-free!
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex sm:justify-center gap-6 pt-8 w-full overflow-x-auto scrollbar-hide px-4 pb-4"
      >
        {specialityData.map((item, index) => (
          <motion.div variants={itemVariants} key={index}>
            <Link
              onClick={() => scrollTo(0, 0)}
              to={`doctors/${item.speciality}`}
              className="min-w-[140px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center py-6 hover:border-blue-500 hover:-translate-y-2 group"
            >
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <img
                  src={item.image}
                  alt={item.speciality}
                  className="w-16 h-16 object-cover"
                />
              </div>
              <p className="font-semibold text-gray-700 text-sm text-center group-hover:text-blue-600 transition-colors">
                {item.speciality}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SpecialityMenu;
