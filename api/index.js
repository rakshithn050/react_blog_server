import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const result = dotenv.config();

mongoose
  .connect(process.env.MongoURL)
  .then(() => {
    console.log("mongodb connection successful");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
