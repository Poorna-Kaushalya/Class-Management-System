const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    month: { type: String, required: true }, 

    amount: { type: Number, default: 1000 },

    status: {
      type: String,
      enum: ["PAID", "PENDING", "ABSENT"],
      default: "PENDING",
    },

    paidDate: { type: String, default: "" }, 
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

feeSchema.index({ studentId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("ClassFee", feeSchema, "fees");
