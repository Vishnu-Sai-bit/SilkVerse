const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Protect All Order Routes
// =====================================

router.use(protect);

// =====================================
// Create Order
// POST /api/orders
// =====================================

router.post("/", createOrder);

// =====================================
// Get Logged-in User Orders
// GET /api/orders
// =====================================

router.get("/", getMyOrders);

// =====================================
// Get Single Order
// GET /api/orders/:id
// =====================================

router.get("/:id", getOrderById);

// =====================================
// Cancel Order
// PATCH /api/orders/:id/cancel
// =====================================

router.patch("/:id/cancel", cancelOrder);

module.exports = router;