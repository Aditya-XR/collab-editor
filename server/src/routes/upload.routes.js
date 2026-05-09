import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/image", authMiddleware, upload.single("image"), uploadImage);

export default router;
