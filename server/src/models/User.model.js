const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ["ADMIN", "STUDENT"], default: "STUDENT" },

    studentId: { type: String, default: null },
    classId: { type: String, default: null },
    phone: { type: String, trim: true, default: null },
    schoolName: { type: String, trim: true, default: null },


    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
