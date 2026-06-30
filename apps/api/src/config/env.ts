import dotenv from "dotenv";

dotenv.config();

export const envVars = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT) || 5001,

  MONGODB_URI: process.env.MONGODB_URI!,

  JWT_SECRET: process.env.JWT_SECRET!,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,

  CLIENT_URL: process.env.CLIENT_URL!,

  REMINDER_INTERVAL_MINUTES:
    Number(process.env.REMINDER_INTERVAL_MINUTES) || 15,
};