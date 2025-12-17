import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorsData);
    }
  }, [docId, doctors, speciality]);

  return (
    <div className="flex flex-col items-center gap-5 my-16 text-gray-800 md:mx-10">
      <h1 className="text-3xl font-semibold">Related Doctors To Book</h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-500">
        Simply browse through our expensive list of trusted doctors
      </p>

      {/* Updated Grid Layout */}
      <div className="w-full flex flex-wrap gap-6 justify-center pt-5 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/myAppointments/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="w-60 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <img
              className="w-full h-40 object-cover bg-blue-50"
              src={item.image}
              alt={item.name}
            />

            <div className="p-4 space-y-1">
              <div
                className={`flex items-center gap-2 text-sm  ${
                  item.available ? "text-green-600" : "text-gray-500"
                } `}
              >
                <span
                  className={`w-2 h-2 ${
                    item.available ? "bg-green-500" : "bg-gray-500"
                  }  rounded-full`}
                ></span>
                {item.available ? "Available" : "Not Available"}
              </div>

              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
        onClick={() => {
          navigate("/Doctors");
          window.scrollTo(0, 0);
        }}
      >
        More Doctors
      </button>
    </div>
  );
};

export default RelatedDoctors;
