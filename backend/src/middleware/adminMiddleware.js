const { adminOnly } = require("./authMiddleware");

// ======================================
// Admin Middleware
// ======================================

const admin = adminOnly;

module.exports = {
  admin,
};