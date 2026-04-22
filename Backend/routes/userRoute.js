import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
  bookAppointment,
  cancelAppointment,
  getProfile,
  listAppointment,
  loginUser,
  paymentRazorPay,
  registerUser,
  updateProfile,
  veriffyRazorpay,
  processPayment,
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
// userRouter.get('/appointments',authUser, listAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorPay);
userRouter.post("/verify-razorpay", authUser, veriffyRazorpay);
userRouter.post("/process-payment", authUser, processPayment);


export default userRouter;

