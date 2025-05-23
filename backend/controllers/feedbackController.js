const Feedback = require("../models/Feedback");
const Company = require("../models/Company");
const SurveyProject = require("../models/SurveyProject");
const sendEmail = require("../utils/email");

// POST /api/feedback/:surveyId
exports.submitFeedback = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { name, email, rating, category, comment, recommend, suggestion } = req.body;

    if (!rating || !category || !comment || !email) {
      return res.status(400).json({ error: "Rating, category, comment, and email are required." });
    }

    const survey = await SurveyProject.findOne({ uniqueHash: surveyId }).populate("companyId");
    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const existing = await Feedback.findOne({ email, surveyId: survey._id });
    if (existing) {
      return res.status(409).json({ message: "Duplicate feedback already submitted." });
    }

    const feedback = new Feedback({
      surveyId: survey._id,
      companyId: survey.companyId._id,
      name,
      email,
      rating,
      category,
      comment,
      recommend,
      suggestion,
    });

    await feedback.save();

    /*try {

      await sendEmail({
        to: survey.companyId.email,
        subject: "New Customer Feedback Received",
        text: `Rating: ${rating}, Comment: "${comment}"`,
        html: `
          <h3>New Feedback Submitted</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Rating:</strong> ${rating}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Comment:</strong> ${comment}</p>
          ${suggestion ? `<p><strong>Suggestion:</strong> ${suggestion}</p>` : ""}
          ${recommend !== undefined ? `<p><strong>Recommend:</strong> ${recommend ? "Yes" : "No"}</p>` : ""}
        `,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }*/

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
