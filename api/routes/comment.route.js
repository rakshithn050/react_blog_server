import express from "express";
import { verifyToken } from "../utils/authVerify.js";
import {
  createNewComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createComment", verifyToken, createNewComment);
router.get("/getPostComments/:postID", getPostComments);
router.put("/likeComment/:postID", verifyToken, likeComment);
router.put("/editComment/:postID", verifyToken, editComment);
router.delete("/deleteComment/:postID", verifyToken, deleteComment);
router.get("/getAllComments", verifyToken, getAllComments);

export default router;
