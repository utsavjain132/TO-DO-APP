import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { User } from "../models/User";
import { generateResetToken } from "../utils/generateResetToken";
import { mailer } from "../config/email";
import { ENV } from "../config/env";
import { resetPasswordTemplate } from "../utils/emailTemplates";

// 1. Request password reset
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with this email");

  const resetToken = generateResetToken();

  user.resetToken = resetToken;
  user.resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${resetToken}`;

  await mailer.sendMail({
    to: user.email,
    from: ENV.SMTP_USER,
    subject: "Password Reset Request",
    html: resetPasswordTemplate(resetUrl),
  });

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
