import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/userController.js";
import { verifyToken } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;