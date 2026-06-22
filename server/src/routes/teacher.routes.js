const router = require("express").Router();

const { authRequired } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const c = require("../controllers/teacher.controller");

/* ADMIN ONLY */
router.post("/", authRequired, allowRoles("ADMIN"), c.createTeacher);
router.get("/", authRequired, allowRoles("ADMIN"), c.getTeachers);
router.get("/:id", authRequired, allowRoles("ADMIN"), c.getTeacher);
router.put("/:id", authRequired, allowRoles("ADMIN"), c.updateTeacher);
router.delete("/:id", authRequired, allowRoles("ADMIN"), c.deleteTeacher);
router.patch("/:id/roles", authRequired, allowRoles("ADMIN"), c.changeTeacherRole);

module.exports = router;