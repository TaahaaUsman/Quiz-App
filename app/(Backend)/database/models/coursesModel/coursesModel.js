import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    voiceNoteUrl: {
      type: String,
    },
    handoutUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
