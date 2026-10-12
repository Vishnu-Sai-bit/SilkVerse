const mongoose = require("mongoose");

// ======================================
// Order Item Schema
// ======================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message:
          "Quantity must be a whole number",
      },
    },
  },
  {
    _id: false,
  }
);

// ======================================
// Order Schema
// ======================================

const orderSchema = new mongoose.Schema(
  {
    // ==================================
    // User
    // ==================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==================================
    // Ordered Products
    // ==================================

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (items) {
          return (
            Array.isArray(items) &&
            items.length > 0
          );
        },

        message:
          "Order must contain at least one item",
      },
    },

    // ==================================
    // Delivery Address
    // ==================================

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // ==================================
    // Pricing
    // ==================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==================================
    // Coupon
    // ==================================

    couponCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    // ==================================
    // Payment
    // ==================================

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "UPI", "Card", "NetBanking", "Wallet"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Refunded",
        "Failed",
      ],
      default: "Pending",
    },

    // ==================================
    // Razorpay Transaction Details
    // ==================================

    razorpayOrderId: {
      type: String,
      default: null,
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
      trim: true,
    },

    razorpaySignature: {
      type: String,
      default: null,
      trim: true,
    },

    // ==================================
    // Resource Restoration Tracking
    // ==================================
    //
    // These fields prevent stock/coupon
    // from being restored more than once.
    //
    // Example:
    //
    // Payment fails
    //      ↓
    // Restore stock
    //      ↓
    // Mark stockRestored = true
    //
    // If the same failure/cancellation is
    // processed again, stock is NOT restored
    // a second time.
    //
    // ==================================

    stockRestored: {
      type: Boolean,
      default: false,
    },

    couponRestored: {
      type: Boolean,
      default: false,
    },

    // ==================================
    // Order Status
    // ==================================

    orderStatus: {
      type: String,

      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],

      default: "Pending",

      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// Useful Indexes
// ======================================

// Quickly find a user's latest orders.
orderSchema.index({
  user: 1,
  createdAt: -1,
});

// Quickly find orders by status.
orderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});

// ======================================
// Export Model
// ======================================

module.exports = mongoose.model(
  "Order",
  orderSchema
);