const express = require("express");
const router = express.Router();

const { signup, login, listCompanies } = require("../controllers/companyController");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Company signup
router.post("/signup", signup);

// Company login
router.post("/login", login);

// Get all companies
router.get("/all",verifyAdmin, listCompanies);

module.exports = router;