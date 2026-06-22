const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    teacherId: { type: String, required: true, unique: true },

    address: {
      no: String,
      street: String,
      lane: String,
      city: String,
    },

    phone: { type: String },

    email: { type: String, required: true, unique: true, lowercase: true },

    passwordHash: { type: String, required: true },

    roles: {
      type: [String],
      enum: ["ADMIN", "TEACHER"],
      default: ["TEACHER"], // can be both ["ADMIN","TEACHER"]
    },

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],

    grades: [
      {
        type: String,
        enum: [
          "Grade 6",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
          "Grade 11",
          "A/L",
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);