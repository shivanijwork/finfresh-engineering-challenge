import express from "express";
import { createTransaction, getFinancialHealth, getSummary, getTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();


router.post("/", verifyToken, createTransaction);
router.get("/", verifyToken, getTransactions);
router.get("/summary", verifyToken, getSummary);
router.get("/financial-health", verifyToken, getFinancialHealth);

export default router;