import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { generateAccessToken } from "../utils/jwt.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeUser = (user) => {
  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;
  return sanitizedUser;
};

const validateSignupInput = ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Email is invalid");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
};

const validateLoginInput = ({ email, password }) => {
  if (!email?.trim() || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Email is invalid");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  validateSignupInput({ name, email: normalizedEmail, password });

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    avatar
  });

  const token = generateAccessToken(user);

  res.status(201).json(
    new ApiResponse("Signup successful", {
      user: sanitizeUser(user),
      token
    })
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  validateLoginInput({ email: normalizedEmail, password });

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateAccessToken(user);

  res.status(200).json(
    new ApiResponse("Login successful", {
      user: sanitizeUser(user),
      token
    })
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse("Current user fetched successfully", {
      user: sanitizeUser(req.user)
    })
  );
});
