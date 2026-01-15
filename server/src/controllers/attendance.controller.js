const Attendance = require("../models/Attendance.model");
const User = require("../models/User.model");

async function markAttendance(req, res) {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // date stored as string 
    const record = await Attendance.findOneAndUpdate(
      { studentId, date },
      { status },
      { upsert: true, new: true }
    );

    return res.json({ message: "Attendance saved", record });
  } catch (err) {
    return res.status(500).json({ message: "Failed to mark attendance" });
  }
}


async function getMyAttendanceByMonth(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id; 
    const { month } = req.query; 

    if (!month) {
      return res.status(400).json({ message: "Month is required (YYYY-MM)" });
    }

    const student = await User.findById(userId).select("studentId");
    if (!student?.studentId) {
      return res.status(404).json({ message: "StudentId not found" });
    }

    const records = await Attendance.find({
      studentId: student.studentId,
      date: { $regex: `^${month}` },
    }).sort({ date: 1 });

    return res.json({
      studentId: student.studentId,
      month,
      records,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load attendance" });
  }
}

module.exports = { markAttendance, getMyAttendanceByMonth };
