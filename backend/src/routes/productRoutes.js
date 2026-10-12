const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCategories,
} = require("../controllers/productController");

// =====================================
// Product Routes
// =====================================

// Get all products
router.get("/", getProducts);

// Get dynamic categories
router.get("/categories", getCategories);

// Get related products
router.get("/:id/related", getRelatedProducts);

// Get single product
router.get("/:id", getProductById);

module.exports = router;