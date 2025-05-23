// routes/visualization.js (or your controller)

const Feedback = require("../models/Feedback");
const mongoose = require("mongoose");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

exports.getVisualizationData = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { surveyId, category } = req.query;

    // Validate surveyId
    if (!surveyId || !mongoose.Types.ObjectId.isValid(surveyId)) {
      return res.status(400).json({ error: "Invalid or missing surveyId" });
    }

    const matchQuery = {
      companyId: new mongoose.Types.ObjectId(companyId),
      surveyId: new mongoose.Types.ObjectId(surveyId),
    };
    if (category) matchQuery.category = category;

    const feedbacks = await Feedback.find(matchQuery);

    const totalFeedbacks = feedbacks.length;
    if (totalFeedbacks === 0) {
      return res.json({
        averageRating: 0,
        sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
        totalFeedbacks: 0,
        trendData: [],
        categoryCounts: [],
        topKeywords: [],
      });
    }

    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const keywordsMap = {};
    const ratingByDate = {};
    const categoryCounts = {};
    let totalRating = 0;

    feedbacks.forEach((fb) => {
      // Rating Aggregation
      totalRating += fb.rating;

      // Sentiment Analysis
      const text = `${fb.comment || ""} ${fb.suggestion || ""}`.trim();
      const result = sentiment.analyze(text);
      if (result.score > 0) sentimentCounts.positive++;
      else if (result.score < 0) sentimentCounts.negative++;
      else sentimentCounts.neutral++;

      // Date Aggregation
      const dateKey = fb.createdAt.toISOString().split("T")[0];
      if (!ratingByDate[dateKey]) ratingByDate[dateKey] = { total: 0, count: 0 };
      ratingByDate[dateKey].total += fb.rating;
      ratingByDate[dateKey].count++;

      // Category Count
      if (fb.category) {
        categoryCounts[fb.category] = (categoryCounts[fb.category] || 0) + 1;
      }

      // Keyword Extraction
      result.words.forEach((word) => {
        keywordsMap[word] = (keywordsMap[word] || 0) + 1;
      });
    });

    const averageRating = (totalRating / totalFeedbacks).toFixed(2);

    const trendData = Object.entries(ratingByDate).map(([date, data]) => ({
      date,
      avgRating: parseFloat((data.total / data.count).toFixed(2)),
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const categoryBreakdown = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat,
      count,
    }));

    const topKeywords = Object.entries(keywordsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    res.json({
      averageRating,
      sentimentCounts,
      totalFeedbacks,
      trendData,
      categoryCounts: categoryBreakdown,
      topKeywords,
    });
  } catch (err) {
    console.error("Error in sentiment visualization:", err);
    res.status(500).json({ error: "Failed to analyze sentiment data" });
  }
};
