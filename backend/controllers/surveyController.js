const SurveyProject = require("../models/SurveyProject");
const { v4: uuidv4 } = require("uuid");

exports.createSurveyProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const companyId = req.company.id;
    console.log(req.body);
    const uniquePath = uuidv4(); // for feedback URL
    const feedbackUrl = `https://yourdomain.com/feedback/${uniquePath}`;

    const newSurvey = new SurveyProject({
      companyId,
      title: name,
      description,
      feedbackUrl,
    });
    console.log(newSurvey);
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


