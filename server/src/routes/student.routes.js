const router = require("express").Router();
const { authRequired } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const {
  createStudent,
  listStudents,
  getMyProfile,
  updateMyProfile,
  bulkCreateStudents,
} = require("../controllers/student.controller");

const {
  createStudentSchema,
  updateMyProfileSchema,
} = require("../validators/student.schema");

const ROLES = require("../constants/roles");

// Student: View own profile
router.get("/me", authRequired, allowRoles(ROLES.STUDENT, ROLES.ADMIN), getMyProfile);

// Student: Update own profile (NO delete)
router.put(
  "/me",
  authRequired,
  allowRoles(ROLES.STUDENT, ROLES.ADMIN),
  (req, res, next) => {
    const parsed = updateMyProfileSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Validation error", errors: parsed.error.issues });
    next();
  },
  updateMyProfile
);

// Admin creates student
router.post(
  "/",
  authRequired,
  allowRoles(ROLES.ADMIN),
  (req, res, next) => {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Validation error", errors: parsed.error.issues });
    next();
  },
  createStudent
);

// Admin/Teacher can view students
router.get("/", authRequired, allowRoles(ROLES.ADMIN, ROLES.TEACHER), listStudents);

// Admin: Bulk create students
router.post("/bulk", authRequired, allowRoles(ROLES.ADMIN), bulkCreateStudents);


module.exports = router;
