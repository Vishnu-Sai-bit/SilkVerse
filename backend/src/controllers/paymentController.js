const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// ======================================
// Razorpay Configuration
// ======================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ONLINE_PAYMENT_METHODS = [
  "Razorpay",
  "UPI",
  "Card",
  "NetBanking",
  "Wallet",
];

// ======================================
// Restore Stock
// ======================================

async function restoreOrderStock(order) {
  if (order.stockRestored) {
    return;
  }

  const claimedOrder = await Order.findOneAndUpdate(
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

  if (!claimedOrder) {
    return;
  }

  try {
    for (const item of order.items) {
      const productId = item?.product?._id || item?.product;
      const quantity = Number(item?.quantity);

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        continue;
      }

      await Product.findByIdAndUpdate(productId, {
        $inc: {
          stock: quantity,
        },
      });

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
  } catch (error) {
    await Order.findByIdAndUpdate(order._id, {
      $set: {
        stockRestored: false,
      },
    });

    throw error;
  }
}

// ======================================
// Restore Coupon Usage
// ======================================

async function restoreOrderCoupon(order) {
  if (!order.couponCode) {
    return;
  }

  if (order.couponRestored) {
    return;
  }

  const claimedOrder = await Order.findOneAndUpdate(
    {
      _id: order._id,
      couponRestored: false,
    },
    {
      $set: {
        couponRestored: true,
      },
    },
    {
      new: true,
    }
  );

  if (!claimedOrder) {
    return;
  }

  try {
    await Coupon.findOneAndUpdate(
      {
        code: order.couponCode,
        usedCount: {
          $gt: 0,
        },
        usedBy: order.user,
      },
      {
        $inc: {
          usedCount: -1,
        },
        $pull: {
          usedBy: order.user,
        },
      }
    );
  } catch (error) {
    await Order.findByIdAndUpdate(order._id, {
      $set: {
        couponRestored: false,
      },
    });

    throw error;
  }
}

// ======================================
// Restore Order Resources
// ======================================

async function restoreOrderResources(order) {
  await restoreOrderStock(order);
  await restoreOrderCoupon(order);
}

// ======================================
// Redeem Coupon
// ======================================

async function redeemOrderCoupon(order) {
  if (!order.couponCode) {
    return;
  }

  const userId = order.user;

  const coupon = await Coupon.findOne({
    code: order.couponCode,
    active: true,
  });

  if (!coupon) {
    throw new Error(
      "Coupon associated with this order is no longer available."
    );
  }

  const alreadyUsed = coupon.usedBy.some(
    (user) => user.toString() === userId.toString()
  );

  if (alreadyUsed) {
    return;
  }

  if (
    coupon.usageLimit > 0 &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new Error(
      "Coupon usage limit has been reached."
    );
  }

  const updatedCoupon =
    await Coupon.findOneAndUpdate(
      {
        _id: coupon._id,
        active: true,

        ...(coupon.usageLimit > 0
          ? {
              usedCount: {
                $lt: coupon.usageLimit,
              },
            }
          : {}),

        usedBy: {
          $ne: userId,
        },
      },
      {
        $inc: {
          usedCount: 1,
        },
        $addToSet: {
          usedBy: userId,
        },
      },
      {
        new: true,
      }
    );

  if (!updatedCoupon) {
    const latestCoupon =
      await Coupon.findById(coupon._id);

    if (
      latestCoupon &&
      latestCoupon.usedBy.some(
        (user) =>
          user.toString() === userId.toString()
      )
    ) {
      return;
    }

    throw new Error(
      "Coupon could not be redeemed."
    );
  }
}

// ======================================
// Create Razorpay Payment Order
// POST /api/payment/create-order
// ======================================

exports.createPaymentOrder = async (
  req,
  res
) => {
  try {
    const { orderId } = req.body;

    // ====================================
    // Validate Order ID
    // ====================================

    if (
      !orderId ||
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid order ID is required.",
      });
    }

    // ====================================
    // Find User's Order
    // ====================================

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ====================================
    // Payment Method
    // ====================================

    if (!ONLINE_PAYMENT_METHODS.includes(order.paymentMethod)) {
      return res.status(400).json({
        success: false,
        message:
          "This order is not configured for online payment.",
      });
    }

    // ====================================
    // Cancelled Order
    // ====================================

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled orders cannot be paid.",
      });
    }

    // ====================================
    // Already Paid In Database
    // ====================================

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message:
          "This order has already been paid.",
      });
    }

    // ====================================
    // Validate Razorpay Credentials
    // ====================================

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      console.error(
        "Razorpay credentials are not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Payment configuration error.",
      });
    }

    // ====================================
    // Database Amount Is Source Of Truth
    // ====================================

    const totalAmount = Number(
      order.totalAmount
    );

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order amount.",
      });
    }

    const amountInPaise = Math.round(
      totalAmount * 100
    );

    // ====================================
    // Reuse Existing Razorpay Order
    // ====================================

    if (order.razorpayOrderId) {
      try {
        const existingOrder =
          await razorpay.orders.fetch(
            order.razorpayOrderId
          );

        // ==================================
        // Validate Existing Razorpay Order
        // ==================================

        if (
          Number(existingOrder.amount) !==
            amountInPaise ||
          existingOrder.currency !== "INR"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Existing Razorpay order does not match the database order.",
          });
        }

        // ==================================
        // Check Existing Razorpay Payments
        // ==================================

        try {
          const paymentCollection =
            await razorpay.orders.fetchPayments(
              existingOrder.id
            );

          const payments =
            Array.isArray(
              paymentCollection?.items
            )
              ? paymentCollection.items
              : [];

          // ==================================
          // Find Matching Captured Payment
          // ==================================

          const capturedPayment =
            payments.find(
              (payment) =>
                payment?.status ===
                  "captured" &&
                Number(
                  payment?.amount
                ) === amountInPaise &&
                payment?.currency ===
                  "INR"
            );

          // ==================================
          // Payment Was Already Captured
          // ==================================

          if (capturedPayment) {
            // --------------------------------
            // Redeem Coupon Safely
            // --------------------------------

            try {
              await redeemOrderCoupon(
                order
              );
            } catch (couponError) {
              console.error(
                "Coupon redemption failed while recovering payment:",
                couponError
              );

              return res.status(500).json({
                success: false,
                message:
                  "Payment was already successful, but coupon redemption could not be completed. Please contact support.",
              });
            }

            // --------------------------------
            // Update Local Order
            // --------------------------------

            order.paymentStatus =
              "Paid";

            if (!ONLINE_PAYMENT_METHODS.includes(order.paymentMethod)) {
              order.paymentMethod =
                "Razorpay";
            }

            order.razorpayOrderId =
              existingOrder.id;

            order.razorpayPaymentId =
              capturedPayment.id;

            // --------------------------------
            // Confirm Order
            // --------------------------------

            if (
              order.orderStatus ===
              "Pending"
            ) {
              order.orderStatus =
                "Confirmed";
            }

            // --------------------------------
            // Save Recovered Payment
            // --------------------------------

            await order.save();

            // --------------------------------
            // Return Recovery Response
            // --------------------------------

            return res.status(200).json({
              success: true,
              paymentRecovered: true,
              message:
                "Payment was already captured. Your order has been confirmed.",
              order: {
                _id: order._id,
                paymentStatus:
                  order.paymentStatus,
                orderStatus:
                  order.orderStatus,
                razorpayOrderId:
                  order.razorpayOrderId,
                razorpayPaymentId:
                  order.razorpayPaymentId,
                totalAmount:
                  order.totalAmount,
              },
            });
          }
        } catch (paymentLookupError) {
          console.error(
            "Razorpay payment lookup failed:",
            paymentLookupError
          );

          return res.status(502).json({
            success: false,
            message:
              "Unable to verify the existing Razorpay payment status. Please try again.",
          });
        }

        // ==================================
        // Existing Razorpay Order Is Still
        // Available For Payment
        // ==================================

        return res.status(200).json({
          success: true,
          paymentRecovered: false,
          order: {
            id: existingOrder.id,
            amount: Number(
              existingOrder.amount
            ),
            currency:
              existingOrder.currency,
          },
        });
      } catch (error) {
        // ==================================
        // Existing Razorpay Order Is Invalid
        // ==================================

        console.warn(
          "Existing Razorpay order could not be fetched:",
          error?.message
        );

        order.razorpayOrderId = null;

        await order.save();
      }
    }

    // ====================================
    // Create New Razorpay Order
    // ====================================

    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `order_${order._id}`,
      });

    // ====================================
    // Validate Razorpay Response
    // ====================================

    if (
      !razorpayOrder ||
      !razorpayOrder.id ||
      Number(razorpayOrder.amount) !==
        amountInPaise ||
      razorpayOrder.currency !== "INR"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid response from Razorpay.",
      });
    }

    // ====================================
    // Save Razorpay Order ID
    // ====================================

    order.razorpayOrderId =
      razorpayOrder.id;

    await order.save();

    // ====================================
    // Response
    // ====================================

    return res.status(200).json({
      success: true,
      paymentRecovered: false,
      order: {
        id: razorpayOrder.id,
        amount: Number(
          razorpayOrder.amount
        ),
        currency:
          razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error(
      "Create Razorpay order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to create Razorpay order.",
    });
  }
};

// ======================================
// Verify Razorpay Payment
// POST /api/payment/verify
// ======================================

exports.verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // ====================================
    // Required Fields
    // ====================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification details are required.",
      });
    }

    // ====================================
    // Validate MongoDB Order ID
    // ====================================

    if (
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID.",
      });
    }

    // ====================================
    // Find User's Order
    // ====================================

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    // ====================================
    // Payment Method
    // ====================================

    if (
      !ONLINE_PAYMENT_METHODS.includes(order.paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order is not configured for online payment.",
      });
    }

    // ====================================
    // Cancelled Order
    // ====================================

    if (
      order.orderStatus ===
      "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled orders cannot be paid.",
      });
    }

    // ====================================
    // Already Paid
    // ====================================

    if (
      order.paymentStatus ===
      "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment has already been verified.",
      });
    }

    // ====================================
    // Match Razorpay Order
    // ====================================

    if (
      !order.razorpayOrderId ||
      order.razorpayOrderId !==
        razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order does not match this order.",
      });
    }

    // ====================================
    // Razorpay Secret
    // ====================================

    const razorpaySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      console.error(
        "RAZORPAY_KEY_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Payment configuration error.",
      });
    }

    // ====================================
    // Generate Signature
    // ====================================

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          razorpaySecret
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    // ====================================
    // Compare Signature
    // ====================================

    if (
      generatedSignature.length !==
      razorpay_signature.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    const signatureMatches =
      crypto.timingSafeEqual(
        Buffer.from(
          generatedSignature,
          "utf8"
        ),
        Buffer.from(
          razorpay_signature,
          "utf8"
        )
      );

    if (!signatureMatches) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    // ====================================
    // Fetch Payment From Razorpay
    // ====================================

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (!razorpayPayment) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment not found.",
      });
    }

    // ====================================
    // Verify Razorpay Order ID
    // ====================================

    if (
      razorpayPayment.order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this Razorpay order.",
      });
    }

    // ====================================
    // Verify Currency
    // ====================================

    if (
      razorpayPayment.currency !==
      "INR"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment currency does not match the order.",
      });
    }

    // ====================================
    // Verify Amount
    // ====================================

    const expectedAmount = Math.round(
      Number(order.totalAmount) * 100
    );

    const paidAmount = Number(
      razorpayPayment.amount
    );

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount !== expectedAmount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment amount does not match the order amount.",
      });
    }

    // ====================================
    // Failed Payment
    // ====================================

    if (
      razorpayPayment.status ===
      "failed"
    ) {
      try {
        await restoreOrderResources(
          order
        );
      } catch (restoreError) {
        console.error(
          "Resource restoration failed:",
          restoreError
        );

        return res.status(500).json({
          success: false,
          message:
            "Payment failed, but order resources could not be restored automatically. Please contact support.",
        });
      }

      order.paymentStatus =
        "Failed";

      order.orderStatus =
        "Cancelled";

      await order.save();

      return res.status(400).json({
        success: false,
        message:
          "Payment failed. The order has been cancelled.",
      });
    }

    // ====================================
    // Authorized But Not Captured
    // ====================================

    if (
      razorpayPayment.status ===
      "authorized"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment is authorized but has not been captured yet.",
      });
    }

    // ====================================
    // Only Captured Is Successful
    // ====================================

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment has not been successfully captured.",
      });
    }

    // ====================================
    // Redeem Coupon
    // ====================================

    try {
      await redeemOrderCoupon(
        order
      );
    } catch (couponError) {
      console.error(
        "Coupon redemption failed:",
        couponError
      );

      return res.status(500).json({
        success: false,
        message:
          "Payment was successful, but coupon redemption could not be completed. Please contact support.",
      });
    }

    // ====================================
    // Save Payment Details
    // ====================================

    order.paymentStatus =
      "Paid";

    if (!ONLINE_PAYMENT_METHODS.includes(order.paymentMethod)) {
      order.paymentMethod =
        "Razorpay";
    }

    order.razorpayOrderId =
      razorpay_order_id;

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    // ====================================
    // Confirm Order
    // ====================================

    if (
      order.orderStatus ===
      "Pending"
    ) {
      order.orderStatus =
        "Confirmed";
    }

    // ====================================
    // Save
    // ====================================

    await order.save();

    // ====================================
    // Response
    // ====================================

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Razorpay verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Payment verification failed.",
    });
  }
};

// ======================================
// Refund Razorpay Payment
// POST /api/payment/refund
// ======================================

exports.refundPayment = async (
  req,
  res
) => {
  try {
    const { orderId } = req.body;

    // ====================================
    // Validate Order ID
    // ====================================

    if (
      !orderId ||
      !mongoose.Types.ObjectId.isValid(
        orderId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid order ID is required.",
      });
    }

    // ====================================
    // Find User's Order
    // ====================================

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    // ====================================
    // Validate Payment Method
    // ====================================

    if (
      !ONLINE_PAYMENT_METHODS.includes(
        order.paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Refund is only available for online payment orders.",
      });
    }

    // ====================================
    // Validate Payment Status
    // ====================================

    if (
      order.paymentStatus !==
      "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order does not have a successful Razorpay payment.",
      });
    }

    // ====================================
    // Validate Razorpay Payment ID
    // ====================================

    if (
      !order.razorpayPaymentId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment ID is missing for this order.",
      });
    }

    // ====================================
    // Validate Razorpay Configuration
    // ====================================

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      console.error(
        "Razorpay credentials are not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Payment configuration error.",
      });
    }

    // ====================================
    // Fetch Payment From Razorpay
    // ====================================

    const razorpayPayment =
      await razorpay.payments.fetch(
        order.razorpayPaymentId
      );

    if (!razorpayPayment) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment could not be found.",
      });
    }

    // ====================================
    // Verify Razorpay Order ID
    // ====================================

    if (
      order.razorpayOrderId &&
      razorpayPayment.order_id !==
        order.razorpayOrderId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment does not belong to this order.",
      });
    }

    // ====================================
    // Only Captured Payments Can Be Refunded
    // ====================================

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only captured Razorpay payments can be refunded.",
      });
    }

    // ====================================
    // Calculate Remaining Refund Amount
    // ====================================

    const paymentAmount =
      Number(
        razorpayPayment.amount || 0
      );

    const amountRefunded =
      Number(
        razorpayPayment.amount_refunded ||
          0
      );

    const remainingAmount =
      paymentAmount -
      amountRefunded;

    // ====================================
    // Already Fully Refunded
    // ====================================

    if (
      remainingAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This Razorpay payment has already been fully refunded.",
      });
    }

    // ====================================
    // Create Full Remaining Refund
    // ====================================

    const refund =
      await razorpay.payments.refund(
        order.razorpayPaymentId,
        {
          // Razorpay expects amount in paise.
          amount:
            remainingAmount,

          notes: {
            orderId:
              order._id.toString(),

            reason:
              "Customer cancelled the order.",
          },
        }
      );

    // ====================================
    // Validate Refund Response
    // ====================================

    if (
      !refund ||
      !refund.id
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay refund could not be created.",
      });
    }

    // ======================================
    // Save Refunded Payment Status
    // ======================================

    order.paymentStatus =
      "Refunded";

    await order.save();

    // ====================================
    // Response
    // ====================================

    return res.status(200).json({
      success: true,

      message:
        "Razorpay refund initiated successfully.",

      refund: {
        id:
          refund.id,

        amount:
          refund.amount,

        currency:
          refund.currency,

        status:
          refund.status,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay refund error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error?.error?.description ||
        error?.message ||
        "Failed to process Razorpay refund.",
    });
  }
};