import express from "express";
import { verifyToken } from "../utils/authVerify.js";
import {
  createNewComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createComment", verifyToken, createNewComment);
router.get("/getPostComments/:postID", getPostComments);

export default router;
