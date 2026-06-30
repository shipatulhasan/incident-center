import mongoose from "mongoose";
import { envVars } from "./env";

export async function connectDatabase() {
  await mongoose.connect(envVars.MONGODB_URI);

  console.log("MongoDB connected");
}