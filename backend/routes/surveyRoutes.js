const express = require("express");
const router = express.Router();
const { createSurveyProject } = require("../controllers/surveyController");
const verifyCompany = require("../middlewares/verifyCompany"); // middleware to authenticate company token

router.post("/create", verifyCompany, createSurveyProject);

module.exports = router;
