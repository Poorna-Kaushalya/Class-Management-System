const router = require("express").Router();
const Timetable = require("../models/Timetable.model");

const { authRequired } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const {
  getMyClassTimetable,
} = require("../controllers/timetable.controller");

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

//  PUBLIC - get timetable (with subject filter)
router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;

    let filter = {};

    if (subject) {
      filter.subject = { $regex: new RegExp(`^${subject}$`, "i") };
    }

    let items = await Timetable.find(filter).lean();

    //  correct sorting
    items.sort((a, b) => {
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return dayOrder[a.day] - dayOrder[b.day];
      }
      return a.time.localeCompare(b.time);
    });

    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to load timetable" });
  }
});

//  ADMIN CREATE
router.post("/", authRequired, adminOnly, async (req, res) => {
  try {
    const { grade, subject, day, time, classType } = req.body;

    const item = await Timetable.create({
      grade,
      subject,
      day,
      time,
      classType,
    });

    res.json(item);
  } catch {
    res.status(400).json({ message: "Failed to create timetable row" });
  }
});

//  ADMIN UPDATE
router.put("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const item = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(item);
  } catch {
    res.status(400).json({ message: "Failed to update timetable row" });
  }
});

//  ADMIN DELETE
router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(400).json({ message: "Failed to delete timetable row" });
  }
});

//  STUDENT TIMETABLE
router.get("/my-class", authRequired, getMyClassTimetable);

module.exports = router;