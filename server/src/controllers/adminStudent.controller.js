const User = require("../models/User.model");
const Timetable = require("../models/Timetable.model");
const Attendance = require("../models/Attendance.model");
const Fee = require("../models/ClassFee.model");
const Notice = require("../models/Notice.model");
const Mark = require("../models/Mark.model");
const ROLES = require("../constants/roles");
const bcrypt = require("bcrypt");

/* -------------------- ADMIN: Create Student -------------------- */
exports.createStudent = async (req, res) => {
  try {
    const { fullName, email, password, studentId, classId, phone, schoolName } = req.body;

    if (!fullName || !email || !password || !studentId || !classId) {
      return res.status(400).json({ message: "fullName, email, password, studentId, classId are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const student = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: ROLES.STUDENT,
      studentId,
      classId,
      phone: phone || "",
      schoolName: schoolName || "",
    });

    return res.status(201).json({
      message: "Student created",
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        classId: student.classId,
        phone: student.phone,
        schoolName: student.schoolName,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to create student" });
  }
};

exports.adminDeleteStudent = async (req, res) => {
  try {
    const { studentUserId } = req.params;

    const student = await User.findById(studentUserId).select("studentId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // delete related records
    if (student.studentId) {
      await Attendance.deleteMany({ studentId: student.studentId });
      await Fee.deleteMany({ studentId: student.studentId });
    }
    await Mark.deleteMany({ student: studentUserId });

    await User.findByIdAndDelete(studentUserId);

    res.json({ ok: true, message: "Student deleted" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to delete student" });
  }
};


/* -------------------- Students List/Search -------------------- */
exports.adminListStudents = async (req, res) => {
  try {
    const { grade = "", q = "", year = "" } = req.query;

    const filter = { role: "STUDENT" };

    if (grade) filter.classId = grade;

    if (q?.trim()) {
      const s = q.trim();
      filter.$or = [
        { fullName: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { studentId: { $regex: s, $options: "i" } },
      ];
    }

    if (year) {
      const y = Number(year);
      if (!Number.isNaN(y)) {
        const start = new Date(`${y}-01-01T00:00:00.000Z`);
        const end = new Date(`${y + 1}-01-01T00:00:00.000Z`);
        filter.createdAt = { $gte: start, $lt: end };
      }
    }

    const students = await User.find(filter)
      .select("fullName email studentId classId createdAt phone schoolName")
      .sort({ createdAt: -1 });

    res.json({ students });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list students" });
  }
};

/* -------------------- Dashboard Bundle -------------------- */
exports.adminGetStudentDashboard = async (req, res) => {
  try {
    const { studentUserId } = req.params;

    const year = req.query.year || String(new Date().getFullYear());
    const month = req.query.month || `${year}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    const student = await User.findById(studentUserId).select(
      "fullName email role studentId classId phone schoolName createdAt"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });

    const timetable = student.classId
      ? await Timetable.find({ grade: student.classId }).sort({ day: 1 })
      : [];

    const attendance = await Attendance.find({
      studentId: student.studentId,
      date: { $regex: `^${month}` }, // YYYY-MM
    }).sort({ date: 1 });

    const fees = await Fee.find({
      studentId: student.studentId,
      month: { $regex: `^${year}-` }, // YYYY-
    }).sort({ month: 1 });

    const now = new Date();
    const notices = student.classId
      ? await Notice.find({
          grade: { $in: [student.classId, "ALL"] },
          $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        }).sort({ createdAt: -1 })
      : [];

    const marks = await Mark.find({
      student: student._id,
      month: { $regex: `^${year}-` },
    }).sort({ month: 1, createdAt: 1 });

    res.json({ student, year, month, timetable, attendance, fees, notices, marks });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load student dashboard" });
  }
};

/* -------------------- Profile Update -------------------- */
exports.adminUpdateStudentProfile = async (req, res) => {
  try {
    const { studentUserId } = req.params;
    const { fullName, phone, schoolName, classId } = req.body;

    const patch = {};
    if (fullName !== undefined) patch.fullName = fullName;
    if (phone !== undefined) patch.phone = phone;
    if (schoolName !== undefined) patch.schoolName = schoolName;
    if (classId !== undefined) patch.classId = classId;

    const updated = await User.findByIdAndUpdate(studentUserId, patch, { new: true }).select(
      "fullName email role studentId classId phone schoolName createdAt"
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json({ user: updated });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to update profile" });
  }
};

/* -------------------- Attendance CRUD -------------------- */
exports.adminUpsertAttendance = async (req, res) => {
  try {
    const { studentUserId } = req.params;
    const { date, status } = req.body;

    if (!date) return res.status(400).json({ message: "date is required" });
    if (!status) return res.status(400).json({ message: "status is required" });

    const student = await User.findById(studentUserId).select("studentId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const row = await Attendance.findOneAndUpdate(
      { studentId: student.studentId, date },
      { studentId: student.studentId, date, status },
      { upsert: true, new: true }
    );

    res.json({ row });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to save attendance" });
  }
};

exports.adminDeleteAttendance = async (req, res) => {
  try {
    const { studentUserId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "date query param is required" });

    const student = await User.findById(studentUserId).select("studentId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Attendance.findOneAndDelete({ studentId: student.studentId, date });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to delete attendance" });
  }
};

/* -------------------- Fees CRUD -------------------- */
exports.adminUpsertFee = async (req, res) => {
  try {
    const { studentUserId } = req.params;
    const { month, status, paidDate } = req.body;

    if (!month) return res.status(400).json({ message: "month is required" });
    if (!status) return res.status(400).json({ message: "status is required" });

    const student = await User.findById(studentUserId).select("studentId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const row = await Fee.findOneAndUpdate(
      { studentId: student.studentId, month },
      { studentId: student.studentId, month, status, paidDate: paidDate || "" },
      { upsert: true, new: true }
    );

    res.json({ row });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to save fee" });
  }
};

exports.adminDeleteFee = async (req, res) => {
  try {
    const { studentUserId } = req.params;
    const { month } = req.query;

    if (!month) return res.status(400).json({ message: "month query param is required" });

    const student = await User.findById(studentUserId).select("studentId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Fee.findOneAndDelete({ studentId: student.studentId, month });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to delete fee" });
  }
};

/* -------------------- Marks CRUD -------------------- */
exports.adminUpsertMark = async (req, res) => {
  try {
    const { studentUserId } = req.params;
    const { markId, month, title, marks, maxMarks } = req.body;

    if (!month) return res.status(400).json({ message: "month is required" });
    if (!title) return res.status(400).json({ message: "title is required" });

    if (markId) {
      const updated = await Mark.findByIdAndUpdate(
        markId,
        { month, title, marks, maxMarks },
        { new: true }
      );
      return res.json({ row: updated });
    }

    const row = await Mark.create({
      student: studentUserId,
      month,
      title,
      marks: Number(marks),
      maxMarks: Number(maxMarks),
    });

    res.json({ row });
  } catch (e) {
    console.error(e);
    if (String(e?.code) === "11000") {
      return res.status(409).json({ message: "Duplicate mark for same month+title" });
    }
    res.status(400).json({ message: "Failed to save marks" });
  }
};

exports.adminDeleteMark = async (req, res) => {
  try {
    const { markId } = req.params;
    await Mark.findByIdAndDelete(markId);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to delete mark" });
  }
};

/* -------------------- Notices CRUD -------------------- */
exports.adminCreateNoticeForGrade = async (req, res) => {
  try {
    const { grade, title, message, expiresAt } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const row = await Notice.create({
      grade: grade || "ALL",
      title,
      message: message || title, // ✅ ensure required field exists
      expiresAt: expiresAt || null,
    });

    res.json({ row });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to create notice" });
  }
};

exports.adminDeleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    await Notice.findByIdAndDelete(noticeId);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to delete notice" });
  }
};
