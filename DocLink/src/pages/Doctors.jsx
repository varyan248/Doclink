import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { doctors } from "../assets/asset";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600 ">Browse through the doctors specilist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5 ">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-blue-400 text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black"
                : ""
            } `}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatrician"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatrician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Pediatrician" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Pediatrician
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black"
                : ""
            } `}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/myAppointments/${item._id}`)}
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
      </div>
    </div>
  );
};

export default Doctors;
