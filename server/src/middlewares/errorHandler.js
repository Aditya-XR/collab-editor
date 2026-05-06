import ApiError from "../utils/ApiError.js";

const getMongooseError = (error) => {
  if (error.name === "ValidationError") {
    return new ApiError(
      400,
      "Validation failed",
      Object.values(error.errors).map((item) => item.message)
    );
  }

  if (error.name === "CastError") {
    return new ApiError(400, "Invalid resource identifier", [error.message]);
  }

  if (error.code === 11000) {
    return new ApiError(409, "Duplicate field value", [error.message]);
  }

  return null;
};

const errorHandler = (error, req, res, next) => {
  const knownError = error instanceof ApiError ? error : getMongooseError(error);
  const normalizedError =
    knownError || new ApiError(error.statusCode || 500, error.message || "Internal Server Error");

  const statusCode = normalizedError.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: normalizedError.message,
    data: null,
    errors: normalizedError.errors || []
  });
};

export default errorHandler;
