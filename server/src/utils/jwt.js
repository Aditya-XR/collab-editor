import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new ApiError(500, "JWT_SECRET is not defined");
  }

  return jwtSecret;
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email
    },
    getJwtSecret(),
    {
      expiresIn: "7d"
    }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};
