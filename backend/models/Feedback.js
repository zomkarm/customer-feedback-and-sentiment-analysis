const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  category: {
    type: String,
    enum: ["Product", "Website", "Customer Support", "Delivery", "Pricing", "UX"],
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  recommend: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Feedback", feedbackSchema);
