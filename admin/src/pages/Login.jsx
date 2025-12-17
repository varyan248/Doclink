import React, { useState, useContext } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Login = () => {
  const [state, setState] = useState("Admin");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (!email || !password) {
  //       toast.error("Please enter email & password");
  //       return;
  //     }
  //     const response = await axios.post(
  //       `${backendUrl}/api/${state.toLowerCase()}/login`,
  //       { email, password }
  //     );

  //     const token = response.data.data.token;
  //     if (!token) {
  //       toast.error("Token missing from server!");
  //       return;
  //     }

  //     // save token locally
  //     localStorage.setItem("aToken", token);
  //     setAToken(token);

  //     toast.success(response.data.message || "Login Successful!");

  //     if (state !== "Admin") {
  //       const { data } = await axios.post(backendUrl + "/api/doctor/login", {
  //         email,
  //         password,
  //       });
  //       if (data.succees) {
  //         localStorage.setItem("dToken", token);
  //         setDToken(token)
  //         console.log(data.token);

  //       }else{
  //       toast.error(data.message)
  //       }
  //     }
  //   } catch (error) {
  //     console.log("LOGIN ERROR →", error);
  //     toast.error(error.response?.data?.message || "Login Failed!");
  //   }
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please enter email & password");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/${state.toLowerCase()}/login`,
        { email, password }
      );

      console.log(response.data); // Debug: check backend output

      if (!response.data.success) {
        toast.error(response.data.message || "Invalid credentials");
        return;
      }

      const token = response.data.token || response.data?.data?.token;
    //const token = response.data.token;
      // const token = response.data?.data?.token;
      console.log("LOGIN RESPONSE:", response.data);
      if (!token) {
        toast.error("Token missing in response!");
        return;
      }

      if (state === "Admin") {
        localStorage.setItem("aToken", token);
        setAToken(token);
      } else {
        localStorage.setItem("dToken", token);
        setDToken(token);
      }
      toast.success("Login Successful!");
    } catch (error) {
      console.log("LOGIN ERROR →", error);
      toast.error(error.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-blue-400">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email:</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#dadada] rounded w-full mt-1 p-2 "
            type="email"
          />
        </div>
        <div className="w-full">
          <p>Password:</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#dadada] rounded w-full mt-1 p-2"
            type="password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-400 rounded-md cursor-pointer text-white text-base py-2 w-full"
        >
          {" "}
          Login{" "}
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span
              className="text-400 underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              {" "}
              Click Here!
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span
              className="text-400 underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              {" "}
              Click Here!
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
