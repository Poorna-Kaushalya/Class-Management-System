const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true }, 

    // Student-specific fields
    studentId: { type: String, default: null },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },

    // refresh token rotation
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
