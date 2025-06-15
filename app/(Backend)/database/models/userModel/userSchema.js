import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "disabled", "deleted"],
      default: "active",
    },
    provider: {
      type: String,
      default: "",
    },

    // Subscription
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    subscriptionType: {
      type: String,
      enum: ["6 months", "1 year", ""],
      default: "",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },

    // Course Related
    bookmarkedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    // Email Verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: String,
    emailVerificationExpiry: Date,

    // Security
    lastLoginAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false },

    // Device Info (optional)
    devices: [
      {
        deviceId: String,
        ip: String,
        location: String,
        lastUsed: Date,
      },
    ],

    // Notifications & Settings
    receiveEmails: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    darkMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
