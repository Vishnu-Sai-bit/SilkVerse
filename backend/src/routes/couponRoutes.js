const express = require("express");

const {
  createCoupon,
  getCoupons,
  getPublicCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  getCouponAnalytics,
} = require("../controllers/couponController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Public Coupons (No Login Required)
// =====================================

router.get("/public", getPublicCoupons);

// =====================================
// Authenticated Coupon Routes
// =====================================

router.use(protect);

// =====================================
// Apply Coupon
// Available to authenticated users
// =====================================

router.post("/apply", applyCoupon);

// =====================================
// Admin Coupon Management
// =====================================

router.post("/", adminOnly, createCoupon);

router.get("/", getCoupons);

router.get(
  "/analytics",
  adminOnly,
  getCouponAnalytics
);

router.get("/:id", getCoupon);

router.put(
  "/:id",
  adminOnly,
  updateCoupon
);

router.delete(
  "/:id",
  adminOnly,
  deleteCoupon
);

module.exports = router;