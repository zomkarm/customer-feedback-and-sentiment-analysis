const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
//app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
//app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get('/a', express.json(), (req, res) => {
  res.send('route reached /a');
});

// Error Handler Middleware
const { errorHandler } = require("./middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || '';
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




