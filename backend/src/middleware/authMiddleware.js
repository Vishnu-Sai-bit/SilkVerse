const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================
// Protect Authenticated Routes
// ======================================

const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    // ======================================
    // Check Authorization Header
    // ======================================

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }

    // ======================================
    // Extract Token
    // ======================================

    const token =
      authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }

    // ======================================
    // Verify JWT
    // ======================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ======================================
    // Find User
    // ======================================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // ======================================
    // Store User in Request
    // ======================================

    req.user = user;

    // ======================================
    // Continue
    // ======================================

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });
  }
};

// ======================================
// Protect Admin Routes
// ======================================

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};