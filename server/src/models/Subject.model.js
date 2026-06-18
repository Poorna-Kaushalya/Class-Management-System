const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    teacher: String,

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

    time: String,

    colors: {
      light: String,
      main: String,
      dark: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);