import express from "express";
import {
  createNewPost,
  getPosts,
  deletePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/authVerify.js";

const router = express.Router();

router.post("/createPost", verifyToken, createNewPost);
router.get("/getPosts", getPosts);
router.delete("/deletePost/:postID/:userId", verifyToken, deletePost);

export default router;
