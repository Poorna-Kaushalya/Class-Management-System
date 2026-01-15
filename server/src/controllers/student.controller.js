const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const ROLES = require("../constants/roles");

// =============================
// ADMIN: Create Student
// =============================
async function createStudent(req, res) {
  const { fullName, email, password, studentId, phone, schoolName } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const student = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    role: ROLES.STUDENT,
    studentId,

    // ✅ NEW
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

  // ✅ NEW
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

module.exports = {
  createStudent,
  listStudents,
  getMyProfile,
  updateMyProfile,
};
