const User = require("../models/User.model");
const Timetable = require("../models/Timetable.model");

// Day order for correct sorting
const dayOrder = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

async function getMyClassTimetable(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { subject } = req.query;

    const student = await User.findById(userId).select("classId");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.classId) {
      return res.json({
        timetable: [],
        message: "No class assigned",
      });
    }

    //  filter by grade + subject
    let filter = { grade: student.classId };

    if (subject) {
      filter.subject = { $regex: new RegExp(`^${subject}$`, "i") }; // case-insensitive
    }

    let timetable = await Timetable.find(filter)
      .select("grade subject day time classType")
      .lean();

    //  custom sorting
    timetable.sort((a, b) => {
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return dayOrder[a.day] - dayOrder[b.day];
      }
      return a.time.localeCompare(b.time);
    });

    return res.json({
      grade: student.classId,
      subject: subject || "All",
      timetable,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to load my class timetable",
    });
  }
}

module.exports = { getMyClassTimetable };