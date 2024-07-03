import express from "express";
import { verifyToken } from "../utils/authVerify.js";
import { createNewComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createComment", verifyToken, createNewComment);

export default router;
