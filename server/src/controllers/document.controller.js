import ApiResponse from "../utils/ApiResponse.js";
import Document from "../models/Document.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  requireDocumentAccess,
  requireDocumentOwner,
  validateMode,
  validateTitle
} from "../services/document.service.js";
import ApiError from "../utils/ApiError.js";

const populateDocumentQuery = (query) => {
  return query.populate("owner", "name email avatar").populate("collaborators.user", "name email avatar");
};

export const createDocument = asyncHandler(async (req, res) => {
  const { title, mode } = req.body;

  validateTitle(title);
  validateMode(mode);

  const document = await Document.create({
    title: title.trim(),
    owner: req.user._id,
    mode: mode || "solo",
    latestSnapshot: {}
  });

  const populatedDocument = await populateDocumentQuery(Document.findById(document._id));

  res.status(201).json(
    new ApiResponse("Document created successfully", {
      document: populatedDocument
    })
  );
});

export const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await populateDocumentQuery(
    Document.find({
      isArchived: false,
      $or: [{ owner: req.user._id }, { "collaborators.user": req.user._id }]
    }).sort({ updatedAt: -1 })
  );

  res.status(200).json(
    new ApiResponse("Documents fetched successfully", {
      documents
    })
  );
});

export const getSingleDocument = asyncHandler(async (req, res) => {
  const document = await requireDocumentAccess(req.params.id, req.user._id);

  res.status(200).json(
    new ApiResponse("Document fetched successfully", {
      document
    })
  );
});

export const renameDocument = asyncHandler(async (req, res) => {
  const { title } = req.body;

  validateTitle(title);

  const document = await requireDocumentOwner(req.params.id, req.user._id);
  document.title = title.trim();
  await document.save();

  res.status(200).json(
    new ApiResponse("Document renamed successfully", {
      document
    })
  );
});

export const archiveDocument = asyncHandler(async (req, res) => {
  const document = await requireDocumentOwner(req.params.id, req.user._id);
  document.isArchived = true;
  await document.save();

  res.status(200).json(
    new ApiResponse("Document archived successfully", {
      document
    })
  );
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await requireDocumentOwner(req.params.id, req.user._id);
  await document.deleteOne();

  res.status(200).json(
    new ApiResponse("Document deleted successfully", {
      document: {
        id: req.params.id
      }
    })
  );
});

export const updateDocumentContent = asyncHandler(async (req, res) => {
  const { latestSnapshot } = req.body;

  if (!Array.isArray(latestSnapshot)) {
    throw new ApiError(400, "latestSnapshot must be an array");
  }

  const document = await requireDocumentAccess(req.params.id, req.user._id);
  document.latestSnapshot = latestSnapshot;
  await document.save();

  res.status(200).json(
    new ApiResponse("Document content saved successfully", {
      document
    })
  );
});
