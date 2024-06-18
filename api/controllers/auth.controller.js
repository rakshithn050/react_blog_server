import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.length === 0 ||
    email.length === 0 ||
    password.length === 0
  ) {
    return res.status(400).json({ message: "All Fields are Required" });
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res.json({ message: "Signup Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
