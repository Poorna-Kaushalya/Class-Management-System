const router = require("express").Router();
const { authRequired } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

const {
  markAttendance,
  getMyAttendanceByMonth,
} = require("../controllers/attendance.controller");

// Admin marks attendance 
router.post("/", authRequired, adminOnly, markAttendance);

// Student reads own attendance by month
router.get("/me", authRequired, getMyAttendanceByMonth);

module.exports = router;
