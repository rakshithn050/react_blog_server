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

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postID: req.params.postID }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.postID);
    if (!comment) {
      next(errorHandler(404, "Could not find comment"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.postID);
    if (!comment) {
      next(errorHandler(404, "Could not find comment"));
    }
    if (comment.userID !== req.user.id || !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.postID,
      {
        $set: { comment: req.body.description },
      },
      { new: true }
    );

    if (!editedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};
