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
      return res.json({ success: false, message: "Invalid credantials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credantials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get doctor appointments for doctor pannel
// export const appointmentsDoctor = async (req, res) => {
//   try {

//     const id = req.user;

//     const appointments = await appointmentModel.find({docId})

//     res.json({success: true, appointments})

//   } catch (error) {
//      console.log(error);
//     return res.json({ success: false, message: error.message });
//   }
// }
export const appointmentsDoctor = async (req, res) => {
  try {
    const { id } = req.user; // get doctor id from middleware
    const appointments = await appointmentModel.find({ docId: id }); // match docId field in DB
   //const appointments = await appointmentModel.find({ docId: new mongoose.Types.ObjectId(id) });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to mark appointment completed for doctor panel
export const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId, docId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to cancel appointment completed for doctor panel
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId, docId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentId.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "cancelation Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for dovtor panel
export const doctorDashboard = async (req, res) => {
  try {
    const { id: docId } = req.user;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
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
  doctorDashboard,
  updateProfile,
  doctorProfile,
};
