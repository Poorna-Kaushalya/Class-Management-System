const router = require("express").Router();

const { authRequired } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const {
  upsertStudentMark,
  getStudentMarksForYear,
  getMyMarksForYear,
} = require("../controllers/marks.controller");

// quick test
router.get("/ping", (req, res) => res.json({ ok: true }));

// ADMIN: add/update marks for a student
router.post(
  "/admin/:studentId",
  authRequired,
  allowRoles("ADMIN"),
  upsertStudentMark
);

// ADMIN: get marks for a student (year)
router.get(
  "/admin/:studentId",
  authRequired,
  allowRoles("ADMIN"),
  getStudentMarksForYear
);

// STUDENT: get own marks (year)
router.get(
  "/me",
  authRequired,
  allowRoles("STUDENT", "ADMIN"),
  getMyMarksForYear
);

module.exports = router;
