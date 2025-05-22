const Feedback = require("../models/Feedback");
const Company = require("../models/Company");
const SurveyProject = require("../models/SurveyProject");

// POST /api/feedback/:surveyId
exports.submitFeedback = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { rating, category, comment, recommend } = req.body;

    // Validate required fields
    if (!rating || !category || !comment) {
      return res.status(400).json({ error: "Rating, category and comment are required." });
    }

    // Validate survey exists
    const survey = await SurveyProject.findById(surveyId).populate("companyId");
    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    // Create feedback
    const feedback = new Feedback({
      surveyId: survey._id,
      companyId: survey.companyId._id,
      rating,
      category,
      comment,
      recommend,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    console.error("Feedback submission failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get all feedbacks for a company (optionally filter by surveyId)
// @route   GET /api/feedback
// @access  Private (Company)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { surveyId, page = 1, limit = 10 } = req.query;

    const query = { companyId };
    if (surveyId) {
      query.surveyId = surveyId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Feedback.countDocuments(query),
    ]);

    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      feedbacks,
      page: parseInt(page),
      pages, 
    });
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};



// @desc    Delete a specific feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Company)
exports.deleteFeedbackById = async (req, res) => {
  try {
    const companyId = req.company._id;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
};