const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeychangeit";

// POST /api/company/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingCompany = await Company.findOne({ email, isActive: true });
    if (existingCompany) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      name,
      email,
      passwordHash,
    });

    await newCompany.save();

    const token = jwt.sign({ id: newCompany._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Company registered successfully.",
      company: {
        id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
};

// POST /api/company/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email, isActive: true });
    if (!company) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, company.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: company._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful.",
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

exports.listCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCompanies = await Company.countDocuments({});
    const companies = await Company.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: show recent first

    res.status(200).json({
      companies,
      currentPage: page,
      totalPages: Math.ceil(totalCompanies / limit),
      totalCompanies,
    });

    //const companies = await Company.find().select("-password");;
    //res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Failed to fetch surveys." });
  }
};