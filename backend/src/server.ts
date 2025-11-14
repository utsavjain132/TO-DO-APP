import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// connect to mongo
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
