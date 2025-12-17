// import mongoose, { mongo } from "mongoose";

// const connetDb = async() => {

//     mongoose.connection.on('connected',() => console.log("Database connected"))
//    await mongoose.connect(`${process.env.MONGODB_URI}/DocLink`)
// }

// export default connetDb

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "DocLink",
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop server if DB fails
  }
};

export default connectDb;
