import { Router } from "express";
import {
  archiveDocument,
  createDocument,
  deleteDocument,
  getMyDocuments,
  getSingleDocument,
  renameDocument,
  updateDocumentContent
} from "../controllers/document.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createDocument);
router.get("/", getMyDocuments);
router.get("/:id", getSingleDocument);
router.patch("/:id/content", updateDocumentContent);
router.patch("/:id/title", renameDocument);
router.patch("/:id/archive", archiveDocument);
router.delete("/:id", deleteDocument);

export default router;
