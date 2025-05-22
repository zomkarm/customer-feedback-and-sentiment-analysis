const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, // <-- soft delete flag
});

module.exports = mongoose.model("Company", CompanySchema);
