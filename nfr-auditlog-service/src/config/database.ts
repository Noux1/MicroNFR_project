import mongoose from "mongoose";
import dotenv from 'dotenv'; // Load environment variables from .env

dotenv.config();

const mongoUri = process.env.MONGO_URI;

export default async () => {
  try {
    if (!mongoUri) {
      throw new Error("mongoUri is not defined in the environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("DB connected");
  } catch (error) {
    console.log("this is an error",error);
  }
};
