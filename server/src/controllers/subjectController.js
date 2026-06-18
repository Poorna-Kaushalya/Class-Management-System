const Subject = require("../models/Subject.model");

// GET ALL
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().lean();
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

// CREATE
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create subject" });
  }
};

//  UPDATE
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update subject" });
  }
};

// DELETE
exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
};