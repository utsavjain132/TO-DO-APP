
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { User } from "../models/User";
import { generateResetToken } from "../utils/generateResetToken";
import { resend } from "../config/email";
import { ENV } from "../config/env";
import { resetPasswordTemplate } from "../utils/emailTemplates";

console.log("🔥 forgotPassword controller reached");
// 1. Request password reset
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  console.log("📨 Checking user:", email);

  const user = await User.findOne({ email });
  console.log("📨 User found?", user ? "YES" : "NO");
  if (!user) throw new Error("No user found with this email");

  const resetToken = generateResetToken();

  user.resetToken = resetToken;
  user.resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${resetToken}`;
  console.log("🔗 Reset URL:", resetUrl);

  console.log("📨 Calling Resend API...");
  
  await resend.emails.send({
  from: ENV.EMAIL_FROM!,
  to: user.email,
  subject: "Password Reset Request",
  html: resetPasswordTemplate(resetUrl),
});
console.log("📨 Resend API executed!");


  res.json({
    message: "Password reset email sent",
  });
});

// 2. Reset password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }, // valid token
  });

  if (!user) throw new Error("Invalid or expired token");

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({
    message: "Password has been reset successfully",
  });
});
