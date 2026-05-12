
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("❌ MONGODB_URI is not defined in environment variables!");
      process.exit(1);
    }

    // Debug: show masked URI so we can verify the right one is being used
    const maskedURI = mongoURI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
    console.log("🔗 Connecting to MongoDB:", maskedURI);

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
