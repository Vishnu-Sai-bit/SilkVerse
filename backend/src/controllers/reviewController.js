const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// =====================================
// Create Review
// =====================================

exports.createReview = async (req, res) => {
  try {
    const {
      product,
      rating,
      comment,
    } = req.body;

    const productId = product;
    const numericRating = Number(rating);

    const trimmedComment =
      typeof comment === "string"
        ? comment.trim()
        : "";

    // =====================================
    // Validate Product
    // =====================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product is required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product.",
      });
    }

    // =====================================
    // Validate Rating
    // =====================================

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be a whole number between 1 and 5.",
      });
    }

    // =====================================
    // Validate Comment
    // =====================================

    if (!trimmedComment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    if (trimmedComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message:
          "Review comment cannot exceed 1000 characters.",
      });
    }

    // =====================================
    // Verify Product Exists
    // =====================================

    const productExists =
      await Product.exists({
        _id: productId,
      });

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // =====================================
    // Verify Delivered Purchase
    // =====================================

    const deliveredOrder =
      await Order.findOne({
        user: req.user.id,
        orderStatus: "Delivered",
        "items.product": productId,
      });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message:
          "You can review this product only after receiving your order.",
      });
    }

    // =====================================
    // One Review Per User Per Product
    // =====================================

    const existingReview =
      await Review.findOne({
        product: productId,
        user: req.user.id,
      });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "You have already reviewed this product.",
      });
    }

    // =====================================
    // Create Review
    // =====================================

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating: numericRating,
      comment: trimmedComment,
    });

    // =====================================
    // Update Product Rating
    // =====================================

    await updateProductRating(productId);

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    // Handle duplicate review race condition
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "You have already reviewed this product.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to create review.",
    });
  }
};

// =====================================
// Get Product Reviews
// =====================================

exports.getProductReviews = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product.",
      });
    }

    const reviews =
      await Review.find({
        product: productId,
      })
        .populate("user", "name")
        .sort({ createdAt: -1 });

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get product reviews error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to fetch reviews.",
    });
  }
};

// =====================================
// Update Review
// =====================================

exports.updateReview = async (
  req,
  res
) => {
  try {
    const numericRating = Number(
      req.body.rating
    );

    const trimmedComment =
      typeof req.body.comment === "string"
        ? req.body.comment.trim()
        : "";

    // =====================================
    // Validate Rating
    // =====================================

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be a whole number between 1 and 5.",
      });
    }

    // =====================================
    // Validate Comment
    // =====================================

    if (!trimmedComment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    if (trimmedComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message:
          "Review comment cannot exceed 1000 characters.",
      });
    }

    // =====================================
    // Find Own Review
    // =====================================

    const review =
      await Review.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // =====================================
    // Update Review
    // =====================================

    review.rating = numericRating;
    review.comment = trimmedComment;

    await review.save();

    // =====================================
    // Update Product Rating
    // =====================================

    await updateProductRating(
      review.product
    );

    return res.json({
      success: true,
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "Update review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to update review.",
    });
  }
};

// =====================================
// Delete Review
// =====================================

exports.deleteReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    // =====================================
    // Update Product Rating
    // =====================================

    await updateProductRating(productId);

    return res.json({
      success: true,
      message:
        "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to delete review.",
    });
  }
};

// =====================================
// Update Product Rating
// =====================================

async function updateProductRating(
  productId
) {
  const reviews =
    await Review.find({
      product: productId,
    });

  let averageRating = 0;

  if (reviews.length > 0) {
    const total = reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    );

    averageRating =
      total / reviews.length;
  }

  await Product.findByIdAndUpdate(
    productId,
    {
      averageRating,
      numReviews: reviews.length,
    }
  );
}