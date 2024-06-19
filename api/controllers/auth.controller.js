import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.trim().length === 0 ||
    email.trim().length === 0 ||
    password.trim().length === 0
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    email.trim().length === 0 ||
    password.trim().length === 0
  ) {
    next(errorHandler(400, "All Fields are required"));
  }

  try {
    // Find user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "User not Found"));
    }

    // Check if password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      next(errorHandler(401, "Incorrect password"));
    }

    const { password: pass, ...restUserInfo } = validUser._doc;

    // Generate JWT token
    const token = jwt.sign(
      { id: validUser._id },
      process.env.SECRET_KEY
      // { expiresIn: "1h", } // Example: token expires in 1 hour
    );

    // Set token as a cookie (assuming you are using cookies)
    res.cookie("access_token", token, { httpOnly: true });

    // Respond with success message and token (you may customize the response as needed)
    res.status(200).json({ message: "Signin successful", restUserInfo, token });
  } catch (error) {
    // Forward error to the next error-handling middleware
    next(error);
  }
};
