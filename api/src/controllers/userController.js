import jwt from "jsonwebtoken";

import User from "../models/User.js";

import catchAsync from "../utils/catchAsync.js";

import {
  successResponse,
  errorResponse,
} from "../utils/errorHandling.js";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// ================= REGISTER =================

export const registerUser = catchAsync(async (req, res) => {

  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return errorResponse(
      res,
      "All fields are required",
      422
    );
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return errorResponse(
      res,
      "Email already exists",
      400
    );
  }

  // Create user
  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  // Generate token
  const token = generateToken(user._id);

  return successResponse(
    res,
    "User registered successfully",
    201,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }
  );
});

// ================= LOGIN =================

export const loginUser = catchAsync(async (req, res) => {

  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return errorResponse(
      res,
      "Email and password are required",
      422
    );
  }

  // Find user
  const user = await User.findOne({ email })
    .select("+passwordHash");

  if (!user) {
    return errorResponse(
      res,
      "Invalid credentials",
      401
    );
  }

  // Compare password
  const isPasswordMatched =
    await user.comparePassword(password);

  if (!isPasswordMatched) {
    return errorResponse(
      res,
      "Invalid credentials",
      401
    );
  }

  // Generate token
  const token = generateToken(user._id);

  return successResponse(
    res,
    "Login successful",
    200,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }
  );
});