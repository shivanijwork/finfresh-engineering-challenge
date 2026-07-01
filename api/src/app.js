import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cached MongoDB connection (serverless reuses it across invocations)
let dbPromise = null;
const connectDB = () => {
  if (!dbPromise) {
    dbPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log("MongoDB connected successfully");
        return conn;
      })
      .catch((err) => {
        dbPromise = null; // allow retry on next request
        throw err;
      });
  }
  return dbPromise;
};

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      message: "Database connection error",
      error: error.message,
    });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "FinFresh API is running successfully",
  });
});

// Auth Routes
app.use("", authRoutes);
app.use("/transactions", transactionRoutes);

// Start a local server only outside Vercel (serverless has no listen)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
