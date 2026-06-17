const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { authRequired } = require("../middlewares/auth.middleware");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
});


//  me
router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "fullName email role studentId phone passwordHash"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      phone: user.phone || "",
      password: "",
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to get user" });
  }
});

// UPDATE USER
router.put("/me", authRequired, async (req, res) => {
  try {
    const { fullName, email, role, phone, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    //  BASIC FIELDS
    if (fullName) user.fullName = fullName;
    if (email) user.email = email.toLowerCase();
    if (phone !== undefined) {
      user.phone = phone;
    }

    // ROLE (ONLY ADMIN CAN CHANGE)
    if (role && req.user.role === "ADMIN") {
      user.role = role;
    }

    //  PASSWORD UPDATE
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;