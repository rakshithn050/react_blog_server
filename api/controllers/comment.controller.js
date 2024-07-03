import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createNewComment = async (req, res, next) => {
  try {
    const { comment, postID, userID } = req.body;

    if (userID !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to comment!!"));
    }

    const newComment = new Comment({
      comment,
      postID,
      userID,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    return next(error);
  }
};
