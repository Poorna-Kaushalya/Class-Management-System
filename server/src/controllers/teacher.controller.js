const Teacher = require("../models/Teacher.model");
const bcrypt = require("bcryptjs");

// CREATE TEACHER 
exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      teacherId,
      address,
      phone,
      email,
      password,
      subjects,
      grades,
      roles,
    } = req.body;

    if (!name || !teacherId || !email || !password) {
      return res.status(400).json({
        message: "name, teacherId, email, password are required",
      });
    }

    const exists = await Teacher.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      teacherId,
      address,
      phone,
      email: email.toLowerCase(),
      passwordHash,
      subjects: subjects || [],
      grades: grades || [],
      roles: roles || ["TEACHER"],
    });

    res.status(201).json({
      message: "Teacher created",
      teacher,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create teacher" });
  }
};

// GET ALL TEACHERS 
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("subjects")
      .sort({ createdAt: -1 });

    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

// GET SINGLE TEACHER
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("subjects");

    if (!teacher) return res.status(404).json({ message: "Not found" });

    res.json({ teacher });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
};

// UPDATE TEACHER
exports.updateTeacher = async (req, res) => {
  try {
    const update = { ...req.body };

    if (update.password) {
      update.passwordHash = await bcrypt.hash(update.password, 10);
      delete update.password;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate("subjects");

    if (!teacher) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Updated", teacher });
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};

// DELETE TEACHER 
exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
};

// CHANGE ROLE (ADMIN <-> TEACHER)
exports.changeTeacherRole = async (req, res) => {
  try {
    const { roles } = req.body; 
    // example: ["ADMIN"] or ["TEACHER"] or ["ADMIN","TEACHER"]

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    );

    if (!teacher) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Role updated", teacher });
  } catch (err) {
    res.status(400).json({ message: "Role update failed" });
  }
};