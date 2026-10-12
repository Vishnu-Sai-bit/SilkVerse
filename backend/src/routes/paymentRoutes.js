const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
  refundPayment,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ======================================
// Create Razorpay Payment Order
// ======================================

router.post(
  "/create-order",
  protect,
  createPaymentOrder
);

// ======================================
// Verify Razorpay Payment
// ======================================

router.post(
  "/verify",
  protect,
  verifyPayment
);

// ======================================
// Refund Razorpay Payment
// ======================================

router.post(
  "/refund",
  protect,
  refundPayment
);

module.exports = router;