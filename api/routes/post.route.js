import express from "express";
import {
  createNewPost,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/authVerify.js";

const router = express.Router();

router.post("/createPost", verifyToken, createNewPost);
router.get("/getPosts", getPosts);
router.delete("/deletePost/:postID/:userId", verifyToken, deletePost);
router.put("/updatePost/:postID/:userId", verifyToken, updatePost);

export default router;
