const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getAnalytics,

  getAllOrders,
  getOrderById,
  updateOrderStatus,

  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ======================================
// Dashboard
// ======================================

router.get(
  "/dashboard",
  protect,
  admin,
  getDashboard
);

// ======================================
// Analytics
// ======================================

router.get(
  "/analytics",
  protect,
  admin,
  getAnalytics
);

// ======================================
// Orders
// ======================================

// Get all orders
router.get(
  "/orders",
  protect,
  admin,
  getAllOrders
);

// Get single order
router.get(
  "/orders/:id",
  protect,
  admin,
  getOrderById
);

// Update order status
router.patch(
  "/orders/:id",
  protect,
  admin,
  updateOrderStatus
);

// ======================================
// Products
// ======================================

// Get all products
router.get(
  "/products",
  protect,
  admin,
  getAllProducts
);

// Get single product
router.get(
  "/products/:id",
  protect,
  admin,
  getProductById
);

// Create product
// Supports maximum 6 gallery images
router.post(
  "/products",
  protect,
  admin,
  upload.array("images", 6),
  createProduct
);

// Update product
// Supports maximum 6 gallery images
router.put(
  "/products/:id",
  protect,
  admin,
  upload.array("images", 6),
  updateProduct
);

// Delete product
router.delete(
  "/products/:id",
  protect,
  admin,
  deleteProduct
);

// ======================================
// Users
// ======================================

// Get all users
router.get(
  "/users",
  protect,
  admin,
  getAllUsers
);

// Update user role
router.patch(
  "/users/:id/role",
  protect,
  admin,
  updateUserRole
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  admin,
  deleteUser
);

module.exports = router;