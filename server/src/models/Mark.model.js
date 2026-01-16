const mongoose = require("mongoose");

const MarkSchema = new mongoose.Schema(
  {
    // Student is a User account 
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true },
    title: { type: String, default: "" },
    marks: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

MarkSchema.index({ student: 1, month: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Mark", MarkSchema);
