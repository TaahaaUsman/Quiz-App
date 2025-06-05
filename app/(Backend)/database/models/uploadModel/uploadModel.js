// models/uploadModel.js
import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadedFiles: {
      type: [String], // URLs of files stored elsewhere (e.g., S3, public folder, etc.)
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);

export default Upload;
