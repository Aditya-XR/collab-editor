import ApiError from "../utils/ApiError.js";
import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = verifyAccessToken(token);
  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new ApiError(401, "Authenticated user no longer exists");
  }

  req.user = user;
  next();
});

export default authMiddleware;
