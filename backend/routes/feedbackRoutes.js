const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/feedbackController");
const verifyCompany = require("../middlewares/verifyCompany");
const {
  getAllFeedbacks,
  deleteFeedbackById,
} = require("../controllers/feedbackController");

// Public route for feedback submission
router.post("/:surveyId", submitFeedback);
// GET /api/feedback - Get all feedbacks (optional surveyId)
router.get("/", verifyCompany, getAllFeedbacks);

// DELETE /api/feedback/:id - Delete specific feedback
router.delete("/:id", verifyCompany, deleteFeedbackById);

module.exports = router;
