import { doctorModel } from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";


export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }
    );
    res.json({ success: true, message: "availability changed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API for login doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get appointments for the logged-in doctor ONLY
export const appointmentsDoctor = async (req, res) => {
  try {
    const { id } = req.user; // get doctor id from auth middleware token
    const appointments = await appointmentModel.find({ docId: id });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to mark appointment completed for doctor panel
export const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.user.id; // get doctor id from auth middleware

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify this appointment belongs to the logged-in doctor
    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({ success: false, message: "Unauthorized: Not your appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });
    return res.json({ success: true, message: "Appointment completed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to cancel appointment for doctor panel
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.user.id; // get doctor id from auth middleware

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify this appointment belongs to the logged-in doctor
    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({ success: false, message: "Unauthorized: Not your appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    return res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to add prescription to an appointment
export const addPrescription = async (req, res) => {
  try {
    const { appointmentId, advice, medicines, notes } = req.body;
    const docId = req.user.id;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID is required" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify this appointment belongs to the logged-in doctor
    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({ success: false, message: "Unauthorized: Not your appointment" });
    }

    if (appointmentData.cancelled) {
      return res.json({ success: false, message: "Cannot prescribe for cancelled appointment" });
    }

    // Build prescription object
    const prescription = {
      advice: advice || '',
      medicines: Array.isArray(medicines) ? medicines : [],
      notes: notes || '',
      prescribedAt: new Date()
    };

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      prescription,
      isCompleted: true  // Auto-mark as completed when prescription is given
    });

    return res.json({ success: true, message: "Prescription added successfully" });
  } catch (error) {
    console.log("Prescription Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for doctor panel
export const doctorDashboard = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += Number(item.amount) || 0;
      }
    });

    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 15),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get doctor profile for doctor panel
export const doctorProfile = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to update doctor profile data from doctor panel
export const updateProfile = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  addPrescription,
  doctorDashboard,
  updateProfile,
  doctorProfile,
};
