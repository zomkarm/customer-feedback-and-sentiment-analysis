// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.stack || err.message);
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  };
  
  module.exports = { errorHandler };
  