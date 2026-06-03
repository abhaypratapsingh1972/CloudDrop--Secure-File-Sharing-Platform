import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("MONGODB_URL =", process.env.MONGODB_URL);

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );

    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;