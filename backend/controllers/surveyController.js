const SurveyProject = require("../models/SurveyProject");
const { v4: uuidv4 } = require("uuid");

exports.createSurveyProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const companyId = req.company.id;
    const uniquePath = uuidv4(); // for feedback URL
    const feedbackUrl = `https://yourdomain.com/feedback/${uniquePath}`;

    const newSurvey = new SurveyProject({
      companyId,
      title,
      description,
      feedbackUrl,
    });
    await newSurvey.save();

    res.status(201).json({
      message: "Survey project created successfully",
      survey: newSurvey,
    });
  } catch (error) {
    console.error("Survey creation error:", error);
    res.status(500).json({ message: "Server error during survey creation" });
  }
};

exports.listSurveys = async (req, res) => {
  try {
    const companyId = req.company._id;

    const surveys = await SurveyProject.find({ companyId: companyId }).sort({ createdAt: -1 });

    res.status(200).json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Failed to fetch surveys." });
  }
};

// DELETE /api/survey/:id
exports.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const survey = await SurveyProject.findOneAndDelete({ _id: id, companyId: companyId });

    if (!survey) return res.status(404).json({ message: "Survey not found" });

    res.status(200).json({ message: "Survey deleted successfully" });
  } catch (err) {
    console.error("Delete survey error:", err);
    res.status(500).json({ message: "Error deleting survey" });
  }
};

// PUT /api/survey/:id
exports.editSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const companyId = req.company._id;

    const updatedSurvey = await SurveyProject.findOneAndUpdate(
      { _id: id, companyId },
      { title, description },
      { new: true }
    );
    if (!updatedSurvey) return res.status(404).json({ message: "Survey not found" });

    res.status(200).json({ message: "Survey updated", survey: updatedSurvey });
  } catch (err) {
    console.error("Edit survey error:", err);
    res.status(500).json({ message: "Error updating survey" });
  }
};
