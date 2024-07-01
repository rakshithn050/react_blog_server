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

export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.order ? (req.query.order === "asc" ? 1 : -1) : 1;
    const filters = {
      ...(req.query.userID && { userID: req.query.userID }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const totalPosts = await Post.countDocuments(filters);
    const totalPages = Math.ceil(totalPosts / perPage);

    const posts = await Post.find(filters)
      .sort({ updatedAt: sortBy })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this post"));
    }

    const post = await Post.findByIdAndDelete(req.params.postID);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    res.status(200).json("The post has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postID,
      {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        image: req.body.image,
      },
      { new: true }
    );

    if (!updatedPost) {
      return next(errorHandler(404, "Post not found"));
    }

    res.status(200).json({
      message: "The post has been updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};