import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of strings
    required: true,
  },
  correctOptionIndex: {
    type: Number,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    type: {
      type: String,
      enum: ["midterm", "finalterm"],
      required: true,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
