import React from "react";
import { specialityData } from "../assets/asset";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      className="flex flex-col items-center gap-4 py-14 text-gray-800"
      id="speciality"
    >
      <h1 className="text-3xl font-medium">Find by Speciality</h1>

      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of doctors and schedule your
        appointment hassle-free!
      </p>

      <div className="flex sm:justify-center gap-6 pt-5 w-full overflow-scroll scrollbar-hide">
        {specialityData.map((item, index) => (
          <Link
            onClick={()=>scrollTo(0,0)}
            key={index}
            to={`doctors/${item.speciality}`}
            className="min-w-[120px] bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center py-4 hover:border-blue-500"
          >
            <img
              src={item.image}
              alt={item.speciality}
              className="w-20 h-20 object-cover rounded-full"
            />
            <p className="mt-2 font-medium text-gray-700 text-sm text-center">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
