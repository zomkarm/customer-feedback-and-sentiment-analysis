// middleware/verifyAnalyst.js
const jwt = require("jsonwebtoken");

const verifyAnalyst = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ANALYST_SECRET);
    req.analystId = decoded.analystId;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyAnalyst;
