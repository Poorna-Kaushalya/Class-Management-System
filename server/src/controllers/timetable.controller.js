const User = require("../models/User.model");
const Timetable = require("../models/Timetable.model");

async function getMyClassTimetable(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;

    const student = await User.findById(userId).select("classId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.classId) {
      return res.json({ timetable: [], message: "No class assigned" });
    }

    const timetable = await Timetable.find({ grade: student.classId })
      .select("grade day time classType")
      .sort({ day: 1 });

    return res.json({ grade: student.classId, timetable });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load my class timetable" });
  }
}

module.exports = { getMyClassTimetable };
