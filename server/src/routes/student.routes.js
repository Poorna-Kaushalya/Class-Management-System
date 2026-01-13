const router = require("express").Router();
const { authRequired } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");
const { createStudent, listStudents } = require("../controllers/student.controller");
const { createStudentSchema } = require("../validators/student.schema");
const ROLES = require("../constants/roles");

// Admin creates student
router.post("/", authRequired, allowRoles(ROLES.ADMIN), (req, res, next) => {
  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Validation error", errors: parsed.error.issues });
  next();
}, createStudent);

// Admin/Teacher can view students
router.get("/", authRequired, allowRoles(ROLES.ADMIN, ROLES.TEACHER), listStudents);

module.exports = router;
