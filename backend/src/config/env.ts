import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLIENT_URL: process.env.CLIENT_URL,
};

if (!ENV.MONGO_URI) throw new Error("Missing MONGO_URI");
if (!ENV.JWT_SECRET) throw new Error("Missing JWT_SECRET");
if (!ENV.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
if (!ENV.EMAIL_FROM) throw new Error("Missing EMAIL_FROM");
