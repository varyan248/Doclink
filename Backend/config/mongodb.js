
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Doclink";
    await mongoose.connect(mongoURI, {
      bufferCommands: false, // Disable buffering to see real errors immediately
      serverSelectionTimeoutMS: 5000, // Fail after 5s instead of 30s
      family: 4, // Force IPv4 (important for local ISPs in Ahmedabad)
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
export default connectDB;
