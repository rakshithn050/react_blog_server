import express from "express";
import { createNewPost } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/authVerify.js";

const router = express.Router();

router.post("/create-post", verifyToken, createNewPost);

export default router;
