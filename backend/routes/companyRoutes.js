const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/companyController");

// Company signup
router.post("/signup", signup);

// Company login
router.post("/login", login);

module.exports = router;