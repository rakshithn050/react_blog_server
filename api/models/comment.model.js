import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    postID: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
