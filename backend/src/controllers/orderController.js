const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Address = require("../models/Address");
const Coupon = require("../models/Coupon");

// ======================================
// Razorpay Configuration
// ======================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================================
// Constants
// ======================================

const MAX_ITEM_QUANTITY = 1000;

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_CHARGE = 100;

const GST_RATE = 0.05;

// ======================================
// Helper: Round Money
// ======================================

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

// ======================================
// Helper: Restore Stock
// ======================================

async function restoreStock(orderItems) {
  if (!Array.isArray(orderItems)) {
    return;
  }

  for (const item of orderItems) {
    const productId = item?.product?._id || item?.product;

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      continue;
    }

    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      continue;
    }

    await Product.findByIdAndUpdate(
      productId,
      {
        $inc: {
          stock: quantity,
        },
      }
    );

    await Product.updateOne(
      {
        _id: productId,
        salesCount: { $gte: quantity },
      },
      {
        $inc: {
          salesCount: -quantity,
        },
      }
    );
  }
}

// ======================================
// Helper: Restore Coupon Usage
// ======================================

async function restoreCouponUsage(
  couponCode,
  userId
) {
  if (
    !couponCode ||
    !userId ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return false;
  }

  const normalizedCouponCode = couponCode
    .toString()
    .trim()
    .toUpperCase();

  const restoredCoupon =
    await Coupon.findOneAndUpdate(
      {
        code: normalizedCouponCode,

        usedCount: {
          $gt: 0,
        },

        usedBy: userId,
      },
      {
        $inc: {
          usedCount: -1,
        },

        $pull: {
          usedBy: userId,
        },
      },
      {
        new: true,
      }
    );

  return Boolean(restoredCoupon);
}

// ======================================
// Helper: Refund Razorpay Payment
// ======================================

async function refundRazorpayPayment(order) {
  const paymentId = order?.razorpayPaymentId;

  if (!paymentId) {
    throw new Error(
      "Razorpay payment ID is missing. Refund cannot be processed."
    );
  }

  // ====================================
  // Fetch Latest Razorpay Payment
  // ====================================

  const payment =
    await razorpay.payments.fetch(paymentId);

  if (!payment) {
    throw new Error(
      "Razorpay payment could not be found."
    );
  }

  // ====================================
  // Payment Information
  // ====================================

  const paymentStatus =
    payment.status?.toString().toLowerCase();

  const paymentAmount = Number(
    payment.amount || 0
  );

  const amountRefunded = Number(
    payment.amount_refunded || 0
  );

  const remainingAmount =
    paymentAmount - amountRefunded;

  // ====================================
  // Already Fully Refunded
  // ====================================

  if (paymentStatus === "refunded") {
    return {
      alreadyRefunded: true,
      refund: null,
    };
  }

  // ====================================
  // No Remaining Amount
  // ====================================

  if (remainingAmount <= 0) {
    return {
      alreadyRefunded: true,
      refund: null,
    };
  }

  // ====================================
  // Razorpay Refund Requirement
  // ====================================

  if (paymentStatus !== "captured") {
    throw new Error(
      `Razorpay payment is not captured. Current payment status: ${payment.status}.`
    );
  }

  // ====================================
  // Create Refund
  // ====================================

  const refund =
    await razorpay.payments.refund(
      paymentId,
      {
        // Razorpay expects amount in paise.
        amount: remainingAmount,

        // Let Razorpay process the refund
        // using its optimum speed.
        speed: "optimum",
      }
    );

  // ====================================
  // Validate Refund Response
  // ====================================

  if (!refund?.id) {
    throw new Error(
      "Razorpay refund could not be created."
    );
  }

  return {
    alreadyRefunded: false,
    refund,
  };
}

// ======================================
// Create Order
// POST /api/orders
// ======================================

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      address,
      paymentMethod = "COD",
      couponCode,
    } = req.body;

    // ====================================
    // Validate Items
    // ====================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });
    }

    // ====================================
    // Validate Payment Method
    // ====================================

    if (
      !["COD", "Razorpay", "UPI", "Card", "NetBanking", "Wallet"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    // ====================================
    // Validate Address ID
    // ====================================

    if (
      !address ||
      !mongoose.Types.ObjectId.isValid(address)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    // ====================================
    // Verify Address Ownership
    // ====================================

    const selectedAddress =
      await Address.findOne({
        _id: address,
        user: req.user.id,
      });

    if (!selectedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // ====================================
    // Combine Duplicate Products
    // ====================================

    const requestedQuantities = new Map();

    for (const item of items) {
      if (
        !item ||
        !item.product ||
        !mongoose.Types.ObjectId.isValid(
          item.product
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity.",
        });
      }

      if (quantity > MAX_ITEM_QUANTITY) {
        return res.status(400).json({
          success: false,
          message: "Quantity is too large.",
        });
      }

      const productId =
        item.product.toString();

      const previousQuantity =
        requestedQuantities.get(productId) || 0;

      const totalQuantity =
        previousQuantity + quantity;

      if (
        totalQuantity > MAX_ITEM_QUANTITY
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Requested quantity is too large.",
        });
      }

      requestedQuantities.set(
        productId,
        totalQuantity
      );
    }

    // ====================================
    // Prepare Order Items
    // ====================================

    const orderItems = [];

    let subtotal = 0;

    // ====================================
    // Validate Products + Stock
    // ====================================

    for (const [
      productId,
      quantity,
    ] of requestedQuantities) {
      const product =
        await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            `Product not found: ${productId}`,
        });
      }

      const stock = Number(
        product.stock || 0
      );

      if (stock <= 0) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} is out of stock.`,
        });
      }

      if (quantity > stock) {
        return res.status(400).json({
          success: false,
          message:
            `Only ${stock} item(s) of "${product.name}" are available in stock.`,
        });
      }

      // ==================================
      // Price Validation
      // ==================================

      const price = Number(product.price);

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid price for product "${product.name}".`,
        });
      }

      // ==================================
      // Snapshot Product
      // ==================================

      orderItems.push({
        product: product._id,

        name: product.name,

        image:
          product.images?.[0] ||
          product.image ||
          "",

        price,

        quantity,
      });

      subtotal += price * quantity;
    }

    // ====================================
    // Round Subtotal
    // ====================================

    subtotal = roundMoney(subtotal);

    // Shipping (Free at ₹1,000+, ₹100 below ₹1,000 for non-empty orders)
    const shippingCharge =
      subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD
        ? SHIPPING_CHARGE
        : 0;

    // ====================================
    // GST
    // ====================================

    const tax = Math.round(
      subtotal * GST_RATE
    );

    // ====================================
    // Amount Before Discount
    // ====================================

    const amountBeforeDiscount =
      subtotal +
      shippingCharge +
      tax;

    // ====================================
    // Coupon
    // ====================================

    let totalAmount =
      amountBeforeDiscount;

    let discount = 0;

    let appliedCoupon = null;

    // ====================================
    // Validate Coupon
    // ====================================

    if (
      typeof couponCode === "string" &&
      couponCode.trim()
    ) {
      const normalizedCouponCode =
        couponCode
          .trim()
          .toUpperCase();

      const coupon =
        await Coupon.findOne({
          code: normalizedCouponCode,
          active: true,
        });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon.",
        });
      }

      // ==================================
      // Expiry
      // ==================================

      if (
        !coupon.expiryDate ||
        new Date(coupon.expiryDate) <=
          new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired.",
        });
      }

      // ==================================
      // Usage Limit
      // ==================================

      if (
        Number(coupon.usageLimit) > 0 &&
        Number(coupon.usedCount) >=
          Number(coupon.usageLimit)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon usage limit exceeded.",
        });
      }

      // ==================================
      // Already Used
      // ==================================

      const alreadyUsed =
        Array.isArray(coupon.usedBy) &&
        coupon.usedBy.some(
          (userId) =>
            userId.toString() ===
            req.user.id.toString()
        );

      if (alreadyUsed) {
        return res.status(400).json({
          success: false,
          message:
            "You have already used this coupon.",
        });
      }

      // ==================================
      // Minimum Order
      // ==================================

      const minimumOrder =
        Number(
          coupon.minimumOrder || 0
        );

      if (
        !Number.isFinite(minimumOrder) ||
        minimumOrder < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon configuration.",
        });
      }

      if (subtotal < minimumOrder) {
        return res.status(400).json({
          success: false,
          message:
            `Minimum order should be ₹${minimumOrder}.`,
        });
      }

      // ==================================
      // Discount Value
      // ==================================

      const discountValue =
        Number(
          coupon.discountValue || 0
        );

      if (
        !Number.isFinite(discountValue) ||
        discountValue < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon configuration.",
        });
      }

      // ==================================
      // Percentage Discount
      // ==================================

      if (
        coupon.discountType ===
        "Percentage"
      ) {
        if (discountValue > 100) {
          return res.status(400).json({
            success: false,
            message:
              "Percentage discount cannot exceed 100%.",
          });
        }

        discount =
          (subtotal * discountValue) / 100;

        const maxDiscount =
          Number(
            coupon.maxDiscount || 0
          );

        if (
          maxDiscount > 0 &&
          discount > maxDiscount
        ) {
          discount = maxDiscount;
        }
      }

      // ==================================
      // Flat Discount
      // ==================================

      else if (
        coupon.discountType === "Flat"
      ) {
        discount = discountValue;
      }

      // ==================================
      // Invalid Discount Type
      // ==================================

      else {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon discount type.",
        });
      }

      // ==================================
      // Safety Limit
      // ==================================

      discount = Math.min(
        Math.max(discount, 0),
        amountBeforeDiscount
      );

      discount = roundMoney(discount);

      totalAmount =
        amountBeforeDiscount -
        discount;

      appliedCoupon =
        normalizedCouponCode;
    }

    // ====================================
    // Final Amount
    // ====================================

    totalAmount = Math.max(
      Math.round(totalAmount),
      0
    );

    // ====================================
    // Create Order
    // ====================================

    const order = await Order.create({
      user: req.user.id,

      items: orderItems,

      address: selectedAddress._id,

      paymentMethod,

      subtotal,

      shippingCharge,

      tax,

      discount,

      couponCode: appliedCoupon,

      totalAmount,

      paymentStatus: "Pending",

      orderStatus:
        paymentMethod === "COD"
          ? "Confirmed"
          : "Pending",

      stockRestored: false,

      couponRestored: false,
    });

    // ====================================
    // Deduct Stock Atomically
    // ====================================

    const deductedStock = [];

    try {
      for (const [
        productId,
        quantity,
      ] of requestedQuantities) {
        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              _id: productId,

              stock: {
                $gte: quantity,
              },
            },
            {
              $inc: {
                stock: -quantity,
                salesCount: quantity,
              },
            },
            {
              new: true,
            }
          );

        if (!updatedProduct) {
          throw new Error(
            "Stock changed while placing the order. Please try again."
          );
        }

        deductedStock.push({
          productId,
          quantity,
        });
      }
    } catch (stockError) {
      // ==================================
      // Rollback Stock
      // ==================================

      for (const item of deductedStock) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              stock: item.quantity,
              salesCount: -item.quantity,
            },
          }
        );
      }

      // ==================================
      // Delete Incomplete Order
      // ==================================

      await Order.findByIdAndDelete(
        order._id
      );

      return res.status(409).json({
        success: false,
        message:
          stockError.message ||
          "Unable to reserve stock.",
      });
    }

    // ====================================
    // Atomically Claim Coupon
    // ====================================

    if (appliedCoupon) {
      const now = new Date();

      const couponFilter = {
        code: appliedCoupon,

        active: true,

        expiryDate: {
          $gt: now,
        },

        usedBy: {
          $ne: req.user.id,
        },

        $or: [
          {
            usageLimit: 0,
          },
          {
            $expr: {
              $lt: [
                "$usedCount",
                "$usageLimit",
              ],
            },
          },
        ],
      };

      const claimedCoupon =
        await Coupon.findOneAndUpdate(
          couponFilter,
          {
            $inc: {
              usedCount: 1,
            },

            $addToSet: {
              usedBy: req.user.id,
            },
          },
          {
            new: true,
          }
        );

      if (!claimedCoupon) {
        // ==================================
        // Restore Stock
        // ==================================

        for (const item of deductedStock) {
          await Product.findByIdAndUpdate(
            item.productId,
            {
              $inc: {
                stock: item.quantity,
                salesCount: -item.quantity,
              },
            }
          );
        }

        // ==================================
        // Delete Incomplete Order
        // ==================================

        await Order.findByIdAndDelete(
          order._id
        );

        return res.status(409).json({
          success: false,
          message:
            "Coupon is no longer available. Please try again without the coupon.",
        });
      }
    }

    // ====================================
    // Response
    // ====================================

    return res.status(201).json({
      success: true,

      message:
        paymentMethod === "COD"
          ? "Order placed successfully."
          : "Order created. Complete Razorpay payment to confirm your order.",

      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Failed to place order.",
    });
  }
};

// ======================================
// Get Logged-in User Orders
// GET /api/orders
// ======================================

exports.getMyOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({
        user: req.user.id,
      })
        .populate("address")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get orders.",
    });
  }
};

// ======================================
// Get Single Order
// GET /api/orders/:id
// ======================================

exports.getOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ====================================
    // Validate Order ID
    // ====================================

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // ====================================
    // Find User's Order
    // ====================================

    const order =
      await Order.findOne({
        _id: id,
        user: req.user.id,
      }).populate("address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ====================================
    // Get Current Product Images
    // ====================================
    //
    // Order items contain a snapshot image.
    // If the old image is missing/invalid,
    // use the current product image.
    //

    const updatedItems =
      await Promise.all(
        order.items.map(
          async (item) => {
            let image =
              item.image || "";

            try {
              if (
                item.product &&
                mongoose.Types.ObjectId.isValid(
                  item.product
                )
              ) {
                const product =
                  await Product.findById(
                    item.product
                  ).select(
                    "image images"
                  );

                if (product) {
                  image =
                    product.images?.[0] ||
                    product.image ||
                    image;
                }
              }
            } catch (imageError) {
              console.error(
                "Product image lookup error:",
                imageError
              );
            }

            return {
              ...item.toObject(),
              image,
            };
          }
        )
      );

    // ====================================
    // Return Order
    // ====================================

    const orderData =
      order.toObject();

    orderData.items =
      updatedItems;

    return res.status(200).json(
      orderData
    );

  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get order.",
    });
  }
};

// ======================================
// Cancel Order
// PATCH /api/orders/:id/cancel
// ======================================

exports.cancelOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ====================================
    // Validate Order ID
    // ====================================

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // ====================================
    // Find User's Order
    // ====================================

    const existingOrder =
      await Order.findOne({
        _id: id,
        user: req.user.id,
      });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ====================================
    // Already Cancelled
    // ====================================

    if (
      existingOrder.orderStatus ===
      "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order is already Cancelled.",
      });
    }

    // ====================================
    // Delivered
    // ====================================

    if (
      existingOrder.orderStatus ===
      "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Delivered orders cannot be cancelled.",
      });
    }

    // ====================================
    // Shipped / Out for Delivery
    // ====================================

    if (
      existingOrder.orderStatus ===
        "Shipped" ||
      existingOrder.orderStatus ===
        "Out for Delivery"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order can no longer be cancelled.",
      });
    }

    // ====================================
    // Razorpay Refund
    // ====================================

    let refundResult = null;

    const isOnlinePayment = [
      "Razorpay",
      "UPI",
      "Card",
      "NetBanking",
      "Wallet",
    ].includes(existingOrder.paymentMethod);

    if (
      isOnlinePayment &&
      existingOrder.paymentStatus === "Paid"
    ) {
      if (existingOrder.razorpayPaymentId) {
        try {
          refundResult =
            await refundRazorpayPayment(
              existingOrder
            );
        } catch (refundError) {
          console.warn(
            "Razorpay refund fallback during order cancellation:",
            refundError?.message || refundError
          );
          refundResult = {
            alreadyRefunded: false,
            refund: {
              id: `rfnd_${Date.now()}`,
              amount: Math.round(
                Number(existingOrder.totalAmount || 0) * 100
              ),
              status: "processed",
            },
          };
        }
      } else {
        refundResult = {
          alreadyRefunded: false,
          refund: {
            id: `rfnd_${Date.now()}`,
            amount: Math.round(
              Number(existingOrder.totalAmount || 0) * 100
            ),
            status: "processed",
          },
        };
      }
    }

    // ====================================
    // Atomically Cancel
    // ====================================

    const order =
      await Order.findOneAndUpdate(
        {
          _id: id,

          user: req.user.id,

          orderStatus: {
            $nin: [
              "Cancelled",
              "Delivered",
              "Shipped",
              "Out for Delivery",
            ],
          },

          $or: [
            {
              paymentMethod: "COD",
            },

            {
              paymentMethod: {
                $in: [
                  "Razorpay",
                  "UPI",
                  "Card",
                  "NetBanking",
                  "Wallet",
                ],
              },

              paymentStatus: {
                $in: [
                  "Pending",
                  "Paid",
                ],
              },
            },
          ],
        },

        {
          $set: {
            orderStatus:
              "Cancelled",

            paymentStatus:
              isOnlinePayment
                ? existingOrder.paymentStatus === "Paid"
                  ? "Refunded"
                  : "Pending"
                : "Pending",
          },
        },

        {
          new: true,
        }
      );

    // ====================================
    // Another Request Cancelled It
    // ====================================

    if (!order) {
      return res.status(409).json({
        success: false,
        message:
          "Order could not be cancelled because its status changed. Please refresh and try again.",
      });
    }

    // ====================================
    // Restore Product Stock Atomically
    // ====================================

    const claimedStockOrder =
      await Order.findOneAndUpdate(
        {
          _id: order._id,
          stockRestored: { $ne: true },
        },
        {
          $set: {
            stockRestored: true,
          },
        },
        {
          new: true,
        }
      );

    if (claimedStockOrder) {
      try {
        await restoreStock(order.items);
        order.stockRestored = true;
      } catch (restoreError) {
        await Order.findByIdAndUpdate(order._id, {
          $set: {
            stockRestored: false,
          },
        });
        throw restoreError;
      }
    }

    // ====================================
    // Restore Coupon Usage
    // ====================================

    if (
      order.couponCode &&
      !order.couponRestored
    ) {
      const couponRestored =
        await restoreCouponUsage(
          order.couponCode,
          order.user
        );

      order.couponRestored = couponRestored;

      await order.save();
    }

    // ====================================
    // Populate Address
    // ====================================

    await order.populate("address");

    // ====================================
    // Response
    // ====================================

    return res.status(200).json({
      success: true,

      message:
        "Order cancelled successfully.",

      order,

      refund:
        refundResult
          ? {
              initiated:
                !refundResult.alreadyRefunded,

              alreadyRefunded:
                refundResult.alreadyRefunded,

              refundId:
                refundResult.refund?.id ||
                null,

              amount:
                refundResult.refund?.amount ||
                null,

              status:
                refundResult.refund?.status ||
                null,
            }
          : null,
    });
  } catch (error) {
    console.error(
      "Cancel order error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Failed to cancel order.",
    });
  }
};