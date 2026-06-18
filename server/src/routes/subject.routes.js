const express = require("express");
const router = express.Router();

const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;