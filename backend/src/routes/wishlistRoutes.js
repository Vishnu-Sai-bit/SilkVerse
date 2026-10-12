const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Authentication
// =====================================
// All wishlist routes require login.

router.use(protect);

// =====================================
// Add Product to Wishlist
// =====================================

router.post("/", addToWishlist);

// =====================================
// Get Logged-in User's Wishlist
// =====================================

router.get("/", getWishlist);

// =====================================
// Remove Wishlist Item
// =====================================

router.delete("/:id", removeWishlistItem);

module.exports = router;