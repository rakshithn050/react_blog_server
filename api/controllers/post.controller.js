import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createNewPost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if (!req.body.title || !req.body.description) {
      return next(errorHandler(400, "Please fill all the required fields"));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "-");

    const newPost = new Post({ ...req.body, slug, userID: req.user.id });

    const savedPost = await newPost.save();

    return res.status(201).json(savedPost);
  } catch (error) {
    return next(error);
  }
};
