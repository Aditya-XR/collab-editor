import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";
import asyncHandler from "./middlewares/asyncHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.get(
  "/api/v1/health",
  asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse("Server is healthy", {}));
  })
);

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;
