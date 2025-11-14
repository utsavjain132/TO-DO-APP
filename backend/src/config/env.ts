import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CLIENT_URL: process.env.CLIENT_URL,
};

// Required right now:
if (!ENV.MONGO_URI) throw new Error("Missing MONGO_URI in .env");
if (!ENV.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

// SMTP will be required later during password reset setup
