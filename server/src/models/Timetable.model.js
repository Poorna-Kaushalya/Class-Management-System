const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true },    
    day: { type: String, required: true },      
    time: { type: String, required: true },      
    classType: { type: String, default: "Theory & Paper" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
