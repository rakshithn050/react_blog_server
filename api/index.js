import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

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

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
