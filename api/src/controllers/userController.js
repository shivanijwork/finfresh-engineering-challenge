import jwt from "jsonwebtoken";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import {successResponse,errorResponse} from "../utils/errorHandling.js";

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
        budgetGoals: user.budgetGoals || {},
      },
    }
  );
});

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
        budgetGoals: user.budgetGoals || {},
      },
    }
  );
});

export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  return successResponse(
    res,
    "Profile fetched successfully",
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        budgetGoals: user.budgetGoals || {},
      },
    }
  );
});

export const updateProfile = catchAsync(async (req, res) => {
  const { name, email, password, budgetGoals } = req.body;
  const user = await User.findById(req.user.id).select("+passwordHash");

  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return errorResponse(res, "Email already in use", 400);
    }
    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  if (password) {
    user.passwordHash = password;
  }

  if (budgetGoals) {
    if (!user.budgetGoals) {
      user.budgetGoals = {};
    }

    if (budgetGoals.monthlyLimit !== undefined) {
      user.budgetGoals.monthlyLimit = Number(budgetGoals.monthlyLimit) || 0;
    }
    if (budgetGoals.savingsGoal !== undefined) {
      user.budgetGoals.savingsGoal = Number(budgetGoals.savingsGoal) || 0;
    }
    if (budgetGoals.debtGoal !== undefined) {
      user.budgetGoals.debtGoal = Number(budgetGoals.debtGoal) || 0;
    }
    if (budgetGoals.debtPayoffDate !== undefined) {
      user.budgetGoals.debtPayoffDate = budgetGoals.debtPayoffDate
        ? new Date(budgetGoals.debtPayoffDate)
        : null;
    }
    if (budgetGoals.categoryBudgets !== undefined) {
      user.budgetGoals.categoryBudgets = budgetGoals.categoryBudgets;
    }
  }

  await user.save();

  return successResponse(
    res,
    "Profile updated successfully",
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        budgetGoals: user.budgetGoals || {},
      },
    }
  );
});