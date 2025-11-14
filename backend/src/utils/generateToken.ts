import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import crypto from "crypto";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};


export const generateToken = (id: string) => {
  return jwt.sign({ id }, ENV.JWT_SECRET!, { expiresIn: "7d" });
};
