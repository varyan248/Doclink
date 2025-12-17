import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { getAllDoctors, aToken, doctors, changeAvailability } = useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);
  return (
    <div className="max-h-[90vh] m-5 overflow-y-scroll ">
      <h1 className="text-lg font-medium"> All Doctors</h1>
      <div className="flex flex-wrap gap-4 pt-5 w-full  gap-y-6">
        {doctors.map((item, index) => (
          <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group" key={index}>
            <img className="bg-indigo-50  group-hover:scale-110 transition-all duration-500" src={item.image} alt="" />
            <div className="p-4">
              <p className="text-lg font-medium text-neutral-800" >{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 items-center flex gap-1 text-sm">
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
