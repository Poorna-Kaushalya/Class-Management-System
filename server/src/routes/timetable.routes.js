const router = require("express").Router();
const mongoose = require("mongoose");

const Timetable = require("../models/Timetable.model");
const Subject = require("../models/Subject.model");

const { authRequired } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const { getMyClassTimetable } = require("../controllers/timetable.controller");

// Day order for sorting
const dayOrder = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

// ==========================
// GET TIMETABLE (FIXED)
// ==========================
router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;

    let filter = {};

    // ✅ SUPPORT BOTH ObjectId & Name
    if (subject) {
      if (mongoose.Types.ObjectId.isValid(subject)) {
        filter.subject = subject;
      } else {
        const subjectDoc = await Subject.findOne({
          name: new RegExp(`^${subject}$`, "i"),
        });

        if (!subjectDoc) return res.json([]);

        filter.subject = subjectDoc._id;
      }
    }

    let items = await Timetable.find(filter)
      .populate("subject") // ✅ IMPORTANT
      .lean();

    // ✅ SORT
    items.sort((a, b) => {
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return dayOrder[a.day] - dayOrder[b.day];
      }
      return a.time.localeCompare(b.time);
    });

    res.json(items);
  } catch (err) {
    console.error("❌ Timetable Error:", err);
    res.status(500).json({ message: "Failed to load timetable" });
  }
});

// ==========================
// CREATE
// ==========================
router.post("/", authRequired, adminOnly, async (req, res) => {
  try {
    const { grade, subject, day, time, classType } = req.body;

    const item = await Timetable.create({
      grade,
      subject, // ObjectId
      day,
      time,
      classType,
    });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create timetable row" });
  }
});

// ==========================
// UPDATE
// ==========================
router.put("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const item = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("subject");

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update timetable row" });
  }
});

// ==========================
// DELETE
// ==========================
router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to delete timetable row" });
  }
});

// ==========================
// STUDENT VIEW
// ==========================
router.get("/my-class", authRequired, getMyClassTimetable);

module.exports = router;