const router = require("express").Router();
const { login, me } = require("../controllers/auth.controller");
const { loginSchema } = require("../validators/auth.schema");
const { authRequired } = require("../middlewares/auth.middleware");

router.post("/login", (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Validation error", errors: parsed.error.issues });
  next();
}, login);

router.get("/me", authRequired, me);

module.exports = router;
