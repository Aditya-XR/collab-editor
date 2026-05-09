import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import Document from "../models/Document.js";

const validModes = ["solo", "collaborative"];

export const validateDocumentId = (documentId) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new ApiError(400, "Invalid document id");
  }
};

export const validateTitle = (title) => {
  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }

  if (title.trim().length > 100) {
    throw new ApiError(400, "Title cannot exceed 100 characters");
  }
};

export const validateMode = (mode) => {
  if (mode && !validModes.includes(mode)) {
    throw new ApiError(400, "Document mode is invalid");
  }
};

export const isDocumentOwner = (document, userId) => {
  return document.owner._id
    ? document.owner._id.toString() === userId.toString()
    : document.owner.toString() === userId.toString();
};

export const isDocumentCollaborator = (document, userId) => {
  return document.collaborators.some((collaborator) => {
    const collaboratorId = collaborator.user._id || collaborator.user;
    return collaboratorId.toString() === userId.toString();
  });
};

export const canAccessDocument = (document, userId) => {
  return isDocumentOwner(document, userId) || isDocumentCollaborator(document, userId);
};

export const getDocumentById = async (documentId) => {
  validateDocumentId(documentId);

  const document = await Document.findById(documentId)
    .populate("owner", "name email avatar")
    .populate("collaborators.user", "name email avatar");

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  return document;
};

export const requireDocumentAccess = async (documentId, userId) => {
  const document = await getDocumentById(documentId);

  if (!canAccessDocument(document, userId)) {
    throw new ApiError(403, "You do not have access to this document");
  }

  return document;
};

export const requireDocumentOwner = async (documentId, userId) => {
  const document = await getDocumentById(documentId);

  if (!isDocumentOwner(document, userId)) {
    throw new ApiError(403, "Only the document owner can perform this action");
  }

  return document;
};
