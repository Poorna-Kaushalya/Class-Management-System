const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const ROLES = require("../constants/roles");

async function createStudent(req, res) {
  const { fullName, email, password, studentId } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const student = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    role: ROLES.STUDENT,
    studentId,
  });

  return res.status(201).json({
    message: "Student created",
    student: { id: student._id, fullName: student.fullName, email: student.email, studentId: student.studentId },
  });
}

async function listStudents(req, res) {
  const students = await User.find({ role: ROLES.STUDENT })
    .select("fullName email studentId createdAt")
    .sort({ createdAt: -1 });

  return res.json({ students });
}

module.exports = { createStudent, listStudents };
