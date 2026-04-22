import validator from "validator";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel.js";
import { doctorModel } from "../models/doctorModel.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

//API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing credantials" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a Strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    if (!token) {
      return res.json({ success: false, message: "Token is not generated" });
    }

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credantials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get user profiles data
const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.user.id).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//API to update user Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      dob,
      gender,
    });

    if (imageFile) {
      //image upload on cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    //Checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //Save new slots data in docdata
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//API tp get user appointmens
const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//API to cancel appointments
// const cancelAppointment = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { appointmentId } = req.body;

//     const appointmentData = await appointmentModel.findById(appointmentId);

//     //Verfied appointment user
//     if (appointmentData.userId.toString() !== userId) {
//       return res.json({ success: false, message: "Unauthorized access" });
//     }

//     await appointmentModel.findByIdAndUpdate(appointmentId, {
//       cancelled: true,
//     });

//     //Releasing doctor slot
//     const { docId, slotDate, slotTime } = appointmentData;

//     const doctorData = await doctorModel.findById(docId);

//     let slots_booked = doctorData.slots_booked

//     slots_booked = slots_booked[slotDate].filter(e => e !== slotTime)

//     await doctorModel.findByIdAndUpdate(docId, {slots_booked})

//     res.json({ success: true, message: "appointment cancelled" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

const cancelAppointment = async (req, res) => {
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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//API to make payment of appointment using razorpay
const paymentRazorPay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    //creating  options for razorpay
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    //creationn of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log("Cancel Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//API to verify payment of razorpay
const veriffyRazorpay = async (req, res) => {
  try {
    const {razorpay_order_id} = req.body;
    const orderInfo = await  razorpayInstance.orders.fetch(razorpay_order_id)
    console.log(orderInfo)
    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment : true})
      res.json({success : true, message : "Payment successfull"})
    } else {
      res.json({success : false, message : "Payment failed"})
    }
  } catch (error) {
    console.log("Cancel Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//API to process payment (GPay / Credit Card / Debit Card)
const processPayment = async (req, res) => {
  try {
    const { appointmentId, paymentMethod, paymentDetails } = req.body;

    if (!appointmentId || !paymentMethod) {
      return res.json({ success: false, message: "Missing payment information" });
    }

    const validMethods = ['gpay', 'credit_card', 'debit_card'];
    if (!validMethods.includes(paymentMethod)) {
      return res.json({ success: false, message: "Invalid payment method" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment is cancelled" });
    }

    if (appointment.payment) {
      return res.json({ success: false, message: "Payment already completed" });
    }

    // Validate payment details based on method
    if (paymentMethod === 'gpay') {
      if (!paymentDetails?.upiId) {
        return res.json({ success: false, message: "UPI ID is required for GPay" });
      }
      // Basic UPI ID validation
      const upiRegex = /^[\w.\-]+@[\w]+$/;
      if (!upiRegex.test(paymentDetails.upiId)) {
        return res.json({ success: false, message: "Invalid UPI ID format" });
      }
    }

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!paymentDetails?.cardNumber || !paymentDetails?.expiry || !paymentDetails?.cvv || !paymentDetails?.cardHolder) {
        return res.json({ success: false, message: "All card details are required" });
      }
      // Basic card number validation (16 digits)
      const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNum)) {
        return res.json({ success: false, message: "Invalid card number (must be 16 digits)" });
      }
      // CVV validation
      if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
        return res.json({ success: false, message: "Invalid CVV" });
      }
      // Expiry validation
      if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) {
        return res.json({ success: false, message: "Invalid expiry date (MM/YY)" });
      }
    }

    // Simulate payment processing (in production, this would call a payment gateway)
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
      paymentMethod: paymentMethod
    });

    const methodNames = {
      gpay: 'Google Pay',
      credit_card: 'Credit Card',
      debit_card: 'Debit Card'
    };

    res.json({
      success: true,
      message: `Payment successful via ${methodNames[paymentMethod]}`
    });

  } catch (error) {
    console.log("Payment Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorPay,
  veriffyRazorpay,
  processPayment
};
