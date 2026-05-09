import { Readable } from "node:stream";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import configureCloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (fileBuffer) => {
  const cloudinary = configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "collaborative-editor",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer);

  res.status(201).json(
    new ApiResponse("Image uploaded successfully", {
      url: result.secure_url
    })
  );
});
