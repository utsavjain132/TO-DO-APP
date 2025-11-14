import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { asyncHandler } from "../middleware/asyncHandler";


export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already registered");

  const user = await User.create({ email, password });

  res.status(201).json({
    message: "Signup successful",
    user: { id: user._id, email: user.email },
  });
});


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  res.json({
    message: "Login successful",
    token,
    user: { id: user._id, email: user.email },
  });
});

