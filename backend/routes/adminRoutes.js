const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/adminController");

// POST /api/admin/signup
router.post("/signup", registerAdmin);

router.post("/login", loginAdmin);


module.exports = router;
