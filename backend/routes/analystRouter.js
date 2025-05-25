// routes/analystAuthRouter.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Analyst = require("../models/Analyst");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const analyst = await Analyst.findOne({ email });
    if (!analyst || !analyst.isActive)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, analyst.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ analystId: analyst._id }, process.env.JWT_ANALYST_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Analyst login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
