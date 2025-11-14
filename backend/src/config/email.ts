import nodemailer from "nodemailer";
import { ENV } from "./env";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});
