import express from "express"
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorList, loginDoctor, doctorDashboard, doctorProfile, updateProfile } from "../controllers/doctorController.js"
import {authDoctor} from "../middlewares/authDoctor.js"

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/doctor-appointment', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor,appointmentCancel)
doctorRouter.get('/doctor-dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/doctor-profile', authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor, updateProfile)


export default doctorRouter