const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ name, email, passwordHash });
    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      //console.log(admin);
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      //console.log(isMatch+"----");
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign({ id: admin._id, name: admin.name, role: "admin"}, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.status(200).json({
        message: "Login successful",
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Toggle company active status (soft delete / restore)
  exports.toggleCompany = async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      company.isActive = !company.isActive;
      await company.save();
  
      res.status(200).json({ 
        message: `Company ${company.isActive ? 'restored' : 'disabled'} successfully`,
        isActive: company.isActive
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };