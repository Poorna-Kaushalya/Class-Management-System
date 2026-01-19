const router = require("express").Router();
const { authRequired } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const c = require("../controllers/adminStudent.controller");

// list/search students
router.get("/", authRequired, allowRoles("ADMIN"), c.adminListStudents);

// dashboard bundle
router.get("/:studentUserId/dashboard", authRequired, allowRoles("ADMIN"), c.adminGetStudentDashboard);
router.delete("/:studentUserId", authRequired, allowRoles("ADMIN"), c.adminDeleteStudent);

// profile update
router.put("/:studentUserId/profile", authRequired, allowRoles("ADMIN"), c.adminUpdateStudentProfile);

// attendance CRUD
router.post("/:studentUserId/attendance", authRequired, allowRoles("ADMIN"), c.adminUpsertAttendance);
router.delete("/:studentUserId/attendance", authRequired, allowRoles("ADMIN"), c.adminDeleteAttendance);

// fee CRUD
router.post("/:studentUserId/fees", authRequired, allowRoles("ADMIN"), c.adminUpsertFee);
router.delete("/:studentUserId/fees", authRequired, allowRoles("ADMIN"), c.adminDeleteFee);

// marks CRUD
router.post("/:studentUserId/marks", authRequired, allowRoles("ADMIN"), c.adminUpsertMark);
router.delete("/marks/:markId", authRequired, allowRoles("ADMIN"), c.adminDeleteMark);

// notices CRUD
router.post("/notices", authRequired, allowRoles("ADMIN"), c.adminCreateNoticeForGrade);
router.delete("/notices/:noticeId", authRequired, allowRoles("ADMIN"), c.adminDeleteNotice);

module.exports = router;
