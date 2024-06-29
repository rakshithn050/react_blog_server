import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: "string",
      required: true,
    },
    category: {
      type: "string",
      required: true,
    },
    description: {
      type: "text",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = new mongoose.Model("post", PostSchema);

export default Post;
