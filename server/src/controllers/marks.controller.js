const Mark = require("../models/Mark.model");
const User = require("../models/User.model"); 

// ADMIN: add/update a student's mark
exports.upsertStudentMark = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, title = "", marks, maxMarks = 100, note = "" } = req.body;

    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "month is required (YYYY-MM)" });
    }
    if (marks === undefined || marks === null || isNaN(Number(marks))) {
      return res.status(400).json({ message: "marks is required (number)" });
    }

    // ensure student exists
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const doc = await Mark.findOneAndUpdate(
      { student: studentId, month, title },
      { marks: Number(marks), maxMarks: Number(maxMarks), note },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ mark: doc });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "Mark already exists for that month/title." });
    }
    console.error(e);
    return res.status(500).json({ message: "Failed to save mark" });
  }
};

// ADMIN: get marks for a student 
exports.getStudentMarksForYear = async (req, res) => {
  try {
    const { studentId } = req.params;
    const year = req.query.year || new Date().getFullYear();

    const start = `${year}-01`;
    const end = `${year}-12`;

    const marks = await Mark.find({
      student: studentId,
      month: { $gte: start, $lte: end },
    }).sort({ month: 1, createdAt: 1 });

    return res.json({ marks });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to fetch marks" });
  }
};

// STUDENT: get own marks 
exports.getMyMarksForYear = async (req, res) => {
  try {
    const studentUserId = req.user?.id; 
    const year = req.query.year || new Date().getFullYear();

    if (!studentUserId) return res.status(401).json({ message: "Unauthorized" });

    const start = `${year}-01`;
    const end = `${year}-12`;

    const marks = await Mark.find({
      student: studentUserId,
      month: { $gte: start, $lte: end },
    }).sort({ month: 1, createdAt: 1 });

    return res.json({ marks });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to fetch my marks" });
  }
};
