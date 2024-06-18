import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.length === 0 ||
    email.length === 0 ||
    password.length === 0
  ) {
    next(errorHandler(400, "All Fields are required"));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res.json({ message: "Signup Successful" });
  } catch (error) {
    next(error);
  }
};
