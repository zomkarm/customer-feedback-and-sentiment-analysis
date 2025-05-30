const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SurveyProject",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  name: {                
    type: String,
    required: true,
  },
  email: {               
    type: String,
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
  suggestion: {         // 👈 Add this
    type: String,
  },
  recommend: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Feedback", feedbackSchema);
