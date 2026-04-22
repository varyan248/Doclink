import { ApiError } from "../utility/ApiError.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { doctorModel } from "../models/doctorModel.js";
import { userModel } from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import jwt from "jsonwebtoken";

//API for adding a doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      fees,
      address,
      speciality,
      degree,
      experience,
      about,
    } = req.body;
    const imageFile = req.file;

    if (!req.file) {
      return res.json(new ApiError(400, "Doctor image is required"));
    }

    if (
      !name ||
      !email ||
      !password ||
      !fees ||
      !address ||
      !speciality ||
      !degree ||
      !experience ||
      !about
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //Hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    //save to database
    const doctotData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      about,
      speciality,
      degree,
      experience,
      fees,
      address,
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctotData);
    await newDoctor.save();
    return res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email }, // payload
        process.env.JWT_SECRET, // secret key
        { expiresIn: "7d" } // optional expiry
      );

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: { token },
      });
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    console.log("LOGIN ERROR →", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


// API to get all doctors
const allDoctors = async (req, res) => {
  try {
    // ✅ Exclude passwords from response
    const doctors = await doctorModel.find({}).select("-password");
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("ALL DOCTORS ERROR →", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


//API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("ALL DOCTORS ERROR →", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID missing" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const doctor = await doctorModel.findById(appointment.docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const date = appointment.slotDate?.toString(); // 🔥 Fix Key Mismatch;
    const time = appointment.slotTime;

    if (!date || !time) {
      return res.json({ success: false, message: "Slot data missing" });
    }

    // Ensure slots_booked exists
    if (!doctor.slots_booked) {
      doctor.slots_booked = {};
    }

    // Ensure slots array for date exists
    if (!doctor.slots_booked[date]) {
      doctor.slots_booked[date] = [];
    }

    // Remove the time from array if exists
    doctor.slots_booked[date] = doctor.slots_booked[date].filter(
      (slot) => slot !== time
    );

    await doctorModel.findByIdAndUpdate(doctor._id, doctor);
    await appointmentModel.findByIdAndDelete(appointmentId);

    return res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log("Cancel Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for admin pannel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    let earnings = 0;
    appointments.forEach((item) => {
      if (item.payment || item.isCompleted) {
        earnings += Number(item.amount) || 0;
      }
    });

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      earnings,
      latestAppointments: appointments.reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log("Dashboard Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
