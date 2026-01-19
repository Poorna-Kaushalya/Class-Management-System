const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const ROLES = require("../constants/roles");

// =============================
// ADMIN: Create Student
// =============================
async function createStudent(req, res) {
  const { fullName, email, password, studentId, classId, phone, schoolName } = req.body;

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
}

// =============================
// ADMIN/TEACHER: List Students
// =============================
async function listStudents(req, res) {
  const students = await User.find({ role: ROLES.STUDENT })
    .select("fullName email studentId classId phone schoolName createdAt")
    .sort({ createdAt: -1 });

  return res.json({ students });
}

// =============================
// STUDENT: View own profile
// =============================
async function getMyProfile(req, res) {
  const userId = req.user?.userId || req.user?.id;

  const user = await User.findById(userId).select(
    "fullName email role studentId classId phone schoolName createdAt"
  );

  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}

// =============================
// STUDENT: Update own profile (NO delete)
// Allowed: fullName, phone, schoolName, password
// =============================
async function updateMyProfile(req, res) {
  const userId = req.user?.userId || req.user?.id;

  const { fullName, phone, schoolName, password } = req.body;

  const updates = {};

  if (typeof fullName === "string") updates.fullName = fullName.trim();

  //  NEW
  if (typeof phone === "string") updates.phone = phone.trim();
  if (typeof schoolName === "string") updates.schoolName = schoolName.trim();

  if (password) {
    updates.passwordHash = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select(
    "fullName email role studentId classId phone schoolName createdAt"
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ message: "Profile updated", user });
}

async function bulkCreateStudents(req, res) {
  try {
    const { students = [] } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "students array is required" });
    }

    const passwordHash = await bcrypt.hash("12345678", 10);

    const docs = students.map((s) => ({
      fullName: s.fullName,
      email: String(s.email).toLowerCase(),
      passwordHash,
      role: ROLES.STUDENT,
      studentId: s.studentId,
      classId: s.classId,
      phone: s.phone || "",
      schoolName: s.schoolName || "Subashie R.M.V",
    }));

    const created = await User.insertMany(docs, { ordered: false });
    return res.status(201).json({ message: "Bulk students created", count: created.length });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Bulk insert failed", error: String(e?.message || e) });
  }
}


module.exports = {
  createStudent,
  listStudents,
  getMyProfile,
  updateMyProfile,
  bulkCreateStudents,
};
