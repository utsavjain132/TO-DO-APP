import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ email, password });

    return res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err });
  }
};
