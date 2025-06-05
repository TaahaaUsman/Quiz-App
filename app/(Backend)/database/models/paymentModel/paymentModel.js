import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    planType: {
      type: String,
      enum: ["6 months", "1 year"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "easypaisa", "jazzcash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },
    challanId: {
      type: String, // only applicable for easypaisa/jazzcash
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
    },
    paymentMethodId: {
      type: String,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
