import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
