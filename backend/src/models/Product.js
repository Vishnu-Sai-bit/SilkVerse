const mongoose = require("mongoose");

const productSchema =
  new mongoose.Schema(
    {
      // ======================================
      // Product Name
      // ======================================

      name: {
        type: String,
        required: true,
        trim: true,
      },

      // ======================================
      // Product Price
      // ======================================

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      // ======================================
      // Product Description
      // ======================================

      description: {
        type: String,
        default: "",
        trim: true,
      },

      // ======================================
      // Product Category
      // ======================================

      category: {
        type: String,
        required: true,
        trim: true,
      },

      // ======================================
      // Cover Image
      // ======================================

      image: {
        type: String,
        default: "",
        trim: true,
      },

      // ======================================
      // Product Gallery
      // Maximum 6 Images
      // ======================================

      images: {
        type: [String],
        default: [],

        validate: {
          validator: function (value) {
            return value.length <= 10;
          },

          message:
            "Maximum 10 images allowed.",
        },
      },

      // ======================================
      // Average Rating
      // ======================================

      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      // ======================================
      // Number of Reviews & Sales
      // ======================================

      numReviews: {
        type: Number,
        default: 0,
        min: 0,
      },

      salesCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      isBestSeller: {
        type: Boolean,
        default: false,
      },

      // ======================================
      // Product Stock
      // ======================================

      stock: {
        type: Number,
        default: 0,
        min: 0,
      },

      originalPrice: {
        type: Number,
        default: 0,
      },

      fabric: {
        type: String,
        default: "100% Pure Mulberry Silk",
      },

      zari: {
        type: String,
        default: "Pure Gold & Silver Tested Zari",
      },

      weave: {
        type: String,
        default: "Traditional Handloom Dharmavaram",
      },

      length: {
        type: String,
        default: "6.3 Metres (Includes 0.8m Blouse)",
      },

      color: {
        type: String,
        default: "",
      },

      occasion: {
        type: String,
        default: "Wedding",
      },

      certification: {
        type: String,
        default: "Silk Mark India Certified",
      },

      isFeatured: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Product",
  productSchema
);