import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password1: {
      type: String,
      required: true,
    },
    password2: {
      type: String,
      required: true,
    },
    password3: {
      type: String,
      required: true,
    },
    emailVerificationCode: String,
    emailVerificationExpiry: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
