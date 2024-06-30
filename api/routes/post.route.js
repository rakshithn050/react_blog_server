import express from "express";
import { createNewPost, getPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/authVerify.js";

const router = express.Router();

router.post("/create-post", verifyToken, createNewPost);
router.get("/getPosts", getPosts);

export default router;
