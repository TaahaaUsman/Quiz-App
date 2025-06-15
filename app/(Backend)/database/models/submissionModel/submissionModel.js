import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    submittedAnswers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedOptionIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

export default Submission;
