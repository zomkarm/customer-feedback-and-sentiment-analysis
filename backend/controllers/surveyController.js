const SurveyProject = require("../models/SurveyProject");
const { v4: uuidv4 } = require("uuid");

exports.createSurveyProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const companyId = req.company.id;
    const uniquePath = uuidv4(); // for feedback URL
    const feedbackUrl = `http://localhost:3000/feedback/${uniquePath}`;

    const newSurvey = new SurveyProject({
      companyId,
      title,
      description,
      feedbackUrl,
      uniqueHash: uniquePath,
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
    const isPaginated = req.query.isPaginated;
    if(isPaginated=="true"){
    
      const companyId = req.company._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await SurveyProject.countDocuments({ companyId });
      const surveys = await SurveyProject.find({ companyId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        surveys,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }else{
      const companyId = req.company._id;

      const surveys = await SurveyProject.find({ companyId: companyId }).sort({ createdAt: -1 });

      res.status(200).json(surveys);
    }
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Failed to fetch surveys." });
  }
};

/*exports.listSurveys = async (req, res) => {
  try {
    const companyId = req.company._id;
    const isPaginated = req.query.isPaginated === "true";

    let surveys, total, page, totalPages;

    if (isPaginated) {
      page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      total = await SurveyProject.countDocuments({ companyId });
      surveys = await SurveyProject.find({ companyId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      totalPages = Math.ceil(total / limit);
    } else {
      surveys = await SurveyProject.find({ companyId }).sort({ createdAt: -1 });
      total = surveys.length;
      page = 1;
      totalPages = 1;
    }

    res.status(200).json({
      surveys,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Failed to fetch surveys." });
  }
};*/


exports.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const survey = await SurveyProject.findOneAndDelete({ _id: id, companyId });

    if (!survey) return res.status(404).json({ message: "Survey not found" });

    res.status(200).json({ message: "Survey deleted successfully" });
  } catch (err) {
    console.error("Delete survey error:", err);
    res.status(500).json({ message: "Error deleting survey" });
  }
};

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

exports.getSurveyById = async (req, res) => {
  try {
    const survey = await SurveyProject.findOne({ uniqueHash: req.params.id });
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    res.status(200).json(survey);
  } catch (err) {
    console.error("Error fetching survey:", err);
    res.status(500).json({ message: "Server error" });
  }
};
