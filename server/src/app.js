import "./config/env.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";
import { sanitizeUser } from "./controllers/auth.controller.js";
import asyncHandler from "./middlewares/asyncHandler.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.get(
  "/api/v1/protected-test",
  authMiddleware,
  asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse("Protected route accessed successfully", {
        user: sanitizeUser(req.user)
      })
    );
  })
);

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;
