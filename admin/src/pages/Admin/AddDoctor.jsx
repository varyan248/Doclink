import React, { useContext, useState, useRef } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null); // not false
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [password, setPassword] = useState("");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [about, setAbout] = useState("");
  const [degree, setDegree] = useState("");
  const [address, setAddress] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);
  const fileRef = useRef(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }
      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("address", address);
      formData.append("fees", fees);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("about", about);
      formData.append("experience", experience);

      //Console log formdata
      formData.forEach((value, key) => {
        console.log(`${key} : ${value} `);
      });

      //API for backend

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { aToken },
          },
      );

      console.log("data", data);

      if (data.success) {
        toast.success(data.message); // show toast here
        setDocImg(null);
        fileRef.current.value = "";
        setAbout("");
        setAddress("");
        setDegree("");
        setEmail("");
        setFees("");
        setName("");
        setPassword("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 font-medium text-lg">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll space-y-6">
        <div className="flex items-center gap-8 mb-8 text-gray-500">
          <label htmlFor="doc-image">
            <img
              className="w-16 border-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            />
          </label>
          <input
            ref={fileRef}
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-image"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-10 items-start lg:flex-row text-gray-600">
          <div className="w-full flex gap-4 flex-col lg:flex-1">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border px-3 py-2 rounded "
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border px-3 py-2 rounded "
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border px-3 py-2 rounded "
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border px-3 py-2 rounded "
                name=""
                id=" "
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border px-3 py-2 rounded "
                type="number"
                placeholder="Fees"
              />
            </div>
          </div>

          {/* RIGHT-SIDE */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border px-3 py-2 rounded "
                name=""
                id=""
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border px-3 py-2 rounded "
                type="text"
                placeholder="Education"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                className="border px-3 py-2 rounded "
                type="text"
                placeholder="Address"
              />
            </div>
          </div>
        </div>
        {/* END SIDE */}
        <div>
          <p className="mt-4 mb-2">About</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            placeholder="Write About Doctor"
          />
        </div>
        <button
          type="submit"
          className="px-10 cursor-pointer py-3 rounded-full mt-4 bg-blue-500 text-white"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
