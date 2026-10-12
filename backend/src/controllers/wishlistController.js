const mongoose = require("mongoose");

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// =====================================
// Add Product to Wishlist
// =====================================

exports.addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;

    // ===================================
    // Validate Product ID
    // ===================================

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // ===================================
    // Check Product Exists
    // ===================================

    const existingProduct =
      await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ===================================
    // Check Already in Wishlist
    // ===================================

    const exists =
      await Wishlist.findOne({
        user: req.user.id,
        product,
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "Product already in wishlist",
      });
    }

    // ===================================
    // Create Wishlist Item
    // ===================================

    const wishlist =
      await Wishlist.create({
        user: req.user.id,
        product,
      });

    return res.status(201).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(
      "Add to wishlist error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Wishlist
// =====================================

exports.getWishlist = async (
  req,
  res
) => {
  try {
    const wishlist =
      await Wishlist.find({
        user: req.user.id,
      }).populate("product");

    return res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(
      "Get wishlist error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Remove Wishlist Item
// =====================================

exports.removeWishlistItem = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ===================================
    // Validate Wishlist ID
    // ===================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist item ID",
      });
    }

    // ===================================
    // Find Wishlist Item
    // ===================================

    const item =
      await Wishlist.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Wishlist item not found",
      });
    }

    // ===================================
    // Ownership Check
    // ===================================

    if (
      item.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ===================================
    // Delete Wishlist Item
    // ===================================

    await item.deleteOne();

    return res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error(
      "Remove wishlist item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};