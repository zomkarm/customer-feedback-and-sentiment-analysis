// scripts/createAnalyst.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Analyst = require("../models/Analyst");

mongoose.connect("mongodb://localhost:27017/feedback-platform");

(async () => {
  const email = "analyst@example.com";
  const password = "securePassword123";
  const passwordHash = await bcrypt.hash(password, 10);

  const analyst = new Analyst({ email, passwordHash });
  await analyst.save();

  console.log("Analyst created:", analyst.email);
  mongoose.disconnect();
})();
