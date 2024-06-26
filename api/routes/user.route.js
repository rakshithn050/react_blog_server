import express from "express";
import { updateUserProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/authVerify.js";

const router = express.Router();

router.put("/update-profile/:userId", verifyToken, updateUserProfile);

export default router;
