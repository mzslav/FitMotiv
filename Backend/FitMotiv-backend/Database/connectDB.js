import mongoose from "mongoose";
import dotenv from 'dotenv';
import { startChallengeScheduler } from '../utils/challengeScheduler.js';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    startChallengeScheduler();
    
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;

