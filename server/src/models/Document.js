import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["editor", "viewer"],
      required: true
    }
  },
  {
    _id: false
  }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    collaborators: {
      type: [collaboratorSchema],
      default: []
    },
    mode: {
      type: String,
      enum: ["solo", "collaborative"],
      default: "solo"
    },
    latestSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({})
    },
    coverImage: {
      type: String,
      default: ""
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

documentSchema.index({ owner: 1, updatedAt: -1 });
documentSchema.index({ "collaborators.user": 1, updatedAt: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;
