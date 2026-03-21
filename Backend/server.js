import express from "express"
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
import connetDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000
connetDb()
connectCloudinary()
//Middlewear

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Allows both just in case
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'atoken', 'Authorization', 'token'],
  credentials: true
}));

//Api endpoint
app.use('/api/admin', adminRouter)  
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

// start app

app.listen(port, () => console.log("Server starteed successfully on  port", port));

