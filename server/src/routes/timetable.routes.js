const router = require("express").Router();
const Timetable = require("../models/Timetable.model");

const { authRequired } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const { getMyClassTimetable } = require("../controllers/timetable.controller");

// Public
router.get("/", async (req, res) => {
  try {
    const items = await Timetable.find().sort({ grade: 1, day: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to load timetable" });
  }
});

// Admin create
router.post("/", authRequired, adminOnly, async (req, res) => {
  try {
    const { grade, day, time, classType } = req.body;
    const item = await Timetable.create({ grade, day, time, classType });
    res.json(item);
  } catch {
    res.status(400).json({ message: "Failed to create timetable row" });
  }
});

// Admin update
router.put("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    const item = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(item);
  } catch {
    res.status(400).json({ message: "Failed to update timetable row" });
  }
});

// Admin delete
router.delete("/:id", authRequired, adminOnly, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(400).json({ message: "Failed to delete timetable row" });
  }
});

// Student timetable for their class
router.get("/my-class", authRequired, getMyClassTimetable);

module.exports = router;
