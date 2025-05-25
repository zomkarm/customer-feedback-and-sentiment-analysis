const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const SurveyProject = require("../models/SurveyProject");
const Company = require("../models/Company");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const { Parser } = require("json2csv");

exports.getFeedbacks = async (req, res) => {
    try {
        const { companyId, from, to, category } = req.query;

        // Build query filter
        let query = {};
        if (companyId) query.companyId = companyId;
        if (category) query.category = category;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        // Populate related data
        const feedbacks = await Feedback.find(query)
            .populate("companyId", "name")              // get company name
            .populate("surveyId", "title")              // get survey title
            .lean();

        // Enrich response
        const enriched = feedbacks.map(fb => ({
            feedbackId: fb._id,
            name: fb.name,
            email: fb.email,
            rating: fb.rating,
            category: fb.category,
            comment: fb.comment,
            suggestion: fb.suggestion,
            recommend: fb.recommend,
            createdAt: fb.createdAt,
            companyId: fb.companyId?._id,
            companyName: fb.companyId?.name || "Unknown",
            surveyId: fb.surveyId?._id,
            surveyName: fb.surveyId?.title || "Unknown",
            location: "N/A" // Update this if location is added to SurveyProject
        }));

        res.json(enriched);
        } catch (err) {
        console.error("Analytics feedback error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.summary = async (req , res) => {
    try {
        const { companyId, surveyId, category, from, to } = req.query;
    
        let query = {};
        if (companyId) query.companyId = companyId;
        if (surveyId) query.surveyId = surveyId;
        if (category) query.category = category;
        if (from || to) {
          query.createdAt = {};
          if (from) query.createdAt.$gte = new Date(from);
          if (to) query.createdAt.$lte = new Date(to);
        }
    
        const feedbacks = await Feedback.find(query).lean();
    
        const total = feedbacks.length;
        const totalRecommend = feedbacks.filter(f => f.recommend).length;
        const avgRating = total > 0
          ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(2)
          : 0;
    
        // Sentiment Analysis
        const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
        for (let f of feedbacks) {
          const result = sentiment.analyze(f.comment || "");
          if (result.score > 0) sentimentCounts.positive++;
          else if (result.score < 0) sentimentCounts.negative++;
          else sentimentCounts.neutral++;
        }
    
        // Category Breakdown
        const categoryStats = {};
        for (let f of feedbacks) {
          if (!categoryStats[f.category]) categoryStats[f.category] = { count: 0 };
          categoryStats[f.category].count++;
        }
    
        res.json({
          totalFeedbacks: total,
          totalRecommend,
          avgRating,
          sentiment: sentimentCounts,
          categoryBreakdown: categoryStats,
        });
      } catch (err) {
        console.error("Summary analytics error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
}

exports.exportData = async (req , res) => {
    try {
        const { companyId, surveyId, category, format = "json", from, to } = req.query;
    
        let query = {};
        if (companyId) query.companyId = companyId;
        if (surveyId) query.surveyId = surveyId;
        if (category) query.category = category;
        if (from || to) {
          query.createdAt = {};
          if (from) query.createdAt.$gte = new Date(from);
          if (to) query.createdAt.$lte = new Date(to);
        }
    
        const feedbacks = await Feedback.find(query)
          .populate("companyId", "name")
          .populate("surveyId", "title")
          .lean();
    
        const formatted = feedbacks.map(fb => ({
          name: fb.name,
          email: fb.email,
          rating: fb.rating,
          category: fb.category,
          comment: fb.comment,
          suggestion: fb.suggestion,
          recommend: fb.recommend,
          createdAt: fb.createdAt,
          companyName: fb.companyId?.name || "Unknown",
          surveyName: fb.surveyId?.title || "Unknown",
        }));
    
        if (format === "csv") {
          const parser = new Parser();
          const csv = parser.parse(formatted);
          res.header("Content-Type", "text/csv");
          res.attachment("feedback_export.csv");
          return res.send(csv);
        }
    
        if (format === "array") {
          return res.json(formatted);
        }
    
        // Default = JSON blob
        res.json({
          exportedAt: new Date(),
          total: formatted.length,
          data: formatted
        });
      } catch (err) {
        console.error("Export analytics error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
}