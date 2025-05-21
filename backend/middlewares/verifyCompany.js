const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeychangeit";

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const company = await Company.findById(decoded.id).select("-passwordHash");

    if (!company) return res.status(401).json({ message: "Company not found" });

    req.company = company;
    next();
  } catch (err) {
    console.error("Company auth error", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
