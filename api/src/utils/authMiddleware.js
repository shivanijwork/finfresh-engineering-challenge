import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {

    // Get Authorization Header
    const authHeader = req.headers.authorization;

    // Check token exists
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        status: false,
        message: "Token missing or invalid",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();

  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};