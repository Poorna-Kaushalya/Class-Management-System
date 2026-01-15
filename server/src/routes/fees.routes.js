const router = require("express").Router();
const { authRequired } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

const { upsertFee, getMyFeesByYear } = require("../controllers/fee.controller");

// Student
router.get("/me", authRequired, getMyFeesByYear);

// Admin
router.post("/", authRequired, adminOnly, upsertFee);

module.exports = router;
