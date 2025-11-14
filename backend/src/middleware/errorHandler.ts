import { Request, Response, NextFunction } from "express";
import { Log } from "../models/Log";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Save to MongoDB
  await Log.create({
    message: err.message || "Unknown error",
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
