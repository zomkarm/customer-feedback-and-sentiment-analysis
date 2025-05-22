const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, toggleCompany } = require("../controllers/adminController");
const verifyAdmin = require("../middlewares/verifyAdmin");

// POST /api/admin/signup
router.post("/signup", registerAdmin);

router.post("/login", loginAdmin);

router.patch("/toggle-company/:id",verifyAdmin, toggleCompany);

module.exports = router;
