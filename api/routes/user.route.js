import express from "express";
import {
  updateUserProfile,
  deleteUserProfile,
  getUsers,
  signout,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/authVerify.js";

const router = express.Router();

router.put("/update-profile/:userId", verifyToken, updateUserProfile);
router.delete("/delete-profile/:userId", verifyToken, deleteUserProfile);
router.get("/getUsers", verifyToken, getUsers);
router.get("/getUser/:userID", getUser);
router.post("/signout", signout);

export default router;
