import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUserProfile = async (req, res, next) => {
  // Authorization check
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this profile")
    );
  }

  // Password validation and hashing
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Username validation
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(
          400,
          "Username must be at least 7 characters and less than 20 characters"
        )
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username cannot contain special characters")
      );
    }
  }

  try {
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...restUserInfo } = updatedUser._doc;
    res.status(200).json(restUserInfo);
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this profile")
    );
  }

  try {
    const userToDelete = await User.findById(req.params.userId);

    if (!userToDelete) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the user to be deleted is an admin
    if (userToDelete.isAdmin) {
      return next(errorHandler(403, "Admin users cannot be deleted"));
    }

    // Delete user
    await User.findByIdAndDelete(req.params.userId);

    res.status(200).send("Profile deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to view the list of users")
      );
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.order ? (req.query.order === "asc" ? 1 : -1) : 1;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / perPage);

    const users = await User.find()
      .sort({ updatedAt: sortBy })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select("-password");

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userID);
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    const { password, ...restUserInfo } = user._doc;
    res.status(200).json(restUserInfo);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .send("User signed out successfully");
  } catch (error) {
    next(error);
  }
};
