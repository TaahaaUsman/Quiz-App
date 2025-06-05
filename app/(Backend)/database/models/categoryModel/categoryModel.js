import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔄 Virtual field: courses (reverse relation)
categorySchema.virtual("courses", {
  ref: "Course", // model to link with
  localField: "_id", // field in this schema
  foreignField: "categoryId", // field in the Course model
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
