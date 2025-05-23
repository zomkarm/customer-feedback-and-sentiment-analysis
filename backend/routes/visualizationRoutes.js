const express = require("express");
const router = express.Router();
const { getVisualizationData } = require("../controllers/visualizationController");
const verifyCompany = require("../middlewares/verifyCompany");

router.get("/", verifyCompany, getVisualizationData);

module.exports = router;
