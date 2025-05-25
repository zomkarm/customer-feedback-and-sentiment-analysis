const express = require("express");
const router = express.Router();
const verifyAnalyst = require("../middlewares/verifyAnalyst");

const { getFeedbacks,summary,exportData } = require("../controllers/analyticsController");

// Get feedback data
router.get("/feedbacks", verifyAnalyst, getFeedbacks);

// Get analytics summary
router.get("/summary", verifyAnalyst ,summary);

// Get analtics summary
router.get("/export", verifyAnalyst, exportData);

module.exports = router;