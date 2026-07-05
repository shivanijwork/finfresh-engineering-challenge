import express from "express";
import { createTransaction, updateTransaction, deleteTransaction, getCurrentDayTransactions, getFinancialHealth, getSummary, getTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();


router.post("/", verifyToken, createTransaction);
router.get("/", verifyToken, getTransactions);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);
router.get("/summary", verifyToken, getSummary);
router.get("/financial-health", verifyToken, getFinancialHealth);
router.get("/current-date", verifyToken, getCurrentDayTransactions);

export default router;