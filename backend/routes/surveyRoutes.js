const express = require("express");
const router = express.Router();
const { createSurveyProject, listSurveys, deleteSurvey, editSurvey } = require("../controllers/surveyController");
const verifyCompany = require("../middlewares/verifyCompany"); // middleware to authenticate company token

router.post("/create", verifyCompany, createSurveyProject);
router.get("/list", verifyCompany, listSurveys); 
router.delete("/:id", verifyCompany, deleteSurvey);
router.put("/:id", verifyCompany, editSurvey);

module.exports = router;
