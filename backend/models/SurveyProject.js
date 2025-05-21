const mongoose = require("mongoose");

const SurveyProjectSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  feedbackUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SurveyProject", SurveyProjectSchema);
