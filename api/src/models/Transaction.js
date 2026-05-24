import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["income", "expense", "investment", "debt"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
transactionSchema.index({
  userId: 1,
  date: -1,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;