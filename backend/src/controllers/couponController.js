const mongoose = require("mongoose");

const Coupon = require("../models/Coupon");

// =====================================
// Constants
// =====================================

const MAX_PERCENTAGE_DISCOUNT = 100;

// =====================================
// Helper: Validate MongoDB ID
// =====================================

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// =====================================
// Helper: Normalize Coupon Code
// =====================================

function normalizeCouponCode(code) {
  if (typeof code !== "string") {
    return "";
  }

  return code.trim().toUpperCase();
}

// =====================================
// Helper: Validate Number
// =====================================

function isValidNonNegativeNumber(value) {
  return (
    Number.isFinite(Number(value)) &&
    Number(value) >= 0
  );
}

// =====================================
// Create Coupon
// POST /api/coupons
// =====================================

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description = "",
      discountType,
      discountValue,
      minimumOrder = 0,
      maxDiscount = 0,
      expiryDate,
      active = true,
      usageLimit = 0,
    } = req.body;

    // ===================================
    // Required Fields
    // ===================================

    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, discount type, discount value and expiry date are required.",
      });
    }

    // ===================================
    // Normalize Code
    // ===================================

    const normalizedCode =
      normalizeCouponCode(code);

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    // ===================================
    // Validate Discount Type
    // ===================================

    if (
      !["Percentage", "Flat"].includes(
        discountType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type.",
      });
    }

    // ===================================
    // Validate Discount Value
    // ===================================

    if (
      !isValidNonNegativeNumber(
        discountValue
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Discount value must be a valid non-negative number.",
      });
    }

    if (
      discountType === "Percentage" &&
      Number(discountValue) >
        MAX_PERCENTAGE_DISCOUNT
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100%.",
      });
    }

    // ===================================
    // Validate Minimum Order
    // ===================================

    if (
      !isValidNonNegativeNumber(
        minimumOrder
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum order must be a valid non-negative number.",
      });
    }

    // ===================================
    // Validate Maximum Discount
    // ===================================

    if (
      !isValidNonNegativeNumber(
        maxDiscount
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum discount must be a valid non-negative number.",
      });
    }

    // ===================================
    // Validate Usage Limit
    // ===================================

    if (
      !Number.isInteger(
        Number(usageLimit)
      ) ||
      Number(usageLimit) < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Usage limit must be a non-negative whole number.",
      });
    }

    // ===================================
    // Validate Expiry
    // ===================================

    const parsedExpiryDate =
      new Date(expiryDate);

    if (
      Number.isNaN(
        parsedExpiryDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry date.",
      });
    }

    // ===================================
    // Check Duplicate Code
    // ===================================

    const existingCoupon =
      await Coupon.findOne({
        code: normalizedCode,
      });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message:
          "A coupon with this code already exists.",
      });
    }

    // ===================================
    // Create Coupon
    // ===================================

    const coupon = await Coupon.create({
      code: normalizedCode,

      description:
        typeof description === "string"
          ? description.trim()
          : "",

      discountType,

      discountValue:
        Number(discountValue),

      minimumOrder:
        Number(minimumOrder),

      maxDiscount:
        Number(maxDiscount),

      expiryDate:
        parsedExpiryDate,

      active:
        active === true,

      usageLimit:
        Number(usageLimit),

      usedCount: 0,

      usedBy: [],
    });

    return res.status(201).json({
      success: true,
      message:
        "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    console.error(
      "Create coupon error:",
      error
    );

    // ===================================
    // Duplicate Key
    // ===================================

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A coupon with this code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to create coupon.",
    });
  }
};

// =====================================
// =====================================
// Ensure Default Storefront Coupons
// =====================================

const DEFAULT_STOREFRONT_COUPONS = [
  {
    code: "SILK10",
    description: "10% Instant Discount on Pure Handloom Silk Sarees",
    discountType: "Percentage",
    discountValue: 10,
    minimumOrder: 1000,
    maxDiscount: 2500,
    expiryDate: new Date("2030-12-31T00:00:00.000Z"),
    active: true,
    usageLimit: 0,
  },
  {
    code: "WELCOME10",
    description: "10% Welcome Privilege Discount on Handloom Silk Sarees",
    discountType: "Percentage",
    discountValue: 10,
    minimumOrder: 1000,
    maxDiscount: 2500,
    expiryDate: new Date("2030-12-31T00:00:00.000Z"),
    active: true,
    usageLimit: 0,
  },
  {
    code: "FESTIVE15",
    description: "15% Festive Celebration Discount on orders above ₹5,000",
    discountType: "Percentage",
    discountValue: 15,
    minimumOrder: 5000,
    maxDiscount: 3500,
    expiryDate: new Date("2030-12-31T00:00:00.000Z"),
    active: true,
    usageLimit: 0,
  },
  {
    code: "ROYAL20",
    description: "20% Royal Bridal & Wedding Heirloom Discount on orders above ₹10,000",
    discountType: "Percentage",
    discountValue: 20,
    minimumOrder: 10000,
    maxDiscount: 5000,
    expiryDate: new Date("2030-12-31T00:00:00.000Z"),
    active: true,
    usageLimit: 0,
  },
  {
    code: "WELCOME500",
    description: "Flat ₹500 Instant Discount on your first SilkVerse order",
    discountType: "Flat",
    discountValue: 500,
    minimumOrder: 3999,
    maxDiscount: 500,
    expiryDate: new Date("2030-12-31T00:00:00.000Z"),
    active: true,
    usageLimit: 0,
  },
  {
    code: "FREESHIP",
    description: "Flat ₹250 Express Insured Delivery Discount on orders above ₹2,999",
    discountType: "Flat",
    discountValue: 250,
    minimumOrder: 2999,
    maxDiscount: 250,
    expiryDate: new Date("2030-12-31T00:00:00.000Z"),
    active: true,
    usageLimit: 0,
  },
];

async function ensureStorefrontCoupons() {
  try {
    for (const item of DEFAULT_STOREFRONT_COUPONS) {
      await Coupon.updateOne(
        { code: item.code },
        { $setOnInsert: item },
        { upsert: true }
      );
    }
  } catch (err) {
    // Non-blocking seed safety
  }
}

// =====================================
// Get All Coupons
// GET /api/coupons
// =====================================

exports.getCoupons = async (
  req,
  res
) => {
  try {
    await ensureStorefrontCoupons();

    const coupons =
      await Coupon.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error(
      "Get coupons error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get coupons.",
    });
  }
};

// =====================================
// Get Public Coupons (For Offers page & Cart)
// GET /api/coupons/public
// =====================================

exports.getPublicCoupons = async (req, res) => {
  try {
    await ensureStorefrontCoupons();

    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      expiryDate: { $gte: now },
    })
      .select("code description discountType discountValue minimumOrder maxDiscount expiryDate")
      .sort({ discountValue: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get public coupons error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public coupons.",
    });
  }
};

// =====================================
// Get Single Coupon
// GET /api/coupons/:id
// =====================================

exports.getCoupon = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ===================================
    // Validate ID
    // ===================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    // ===================================
    // Find Coupon
    // ===================================

    const coupon =
      await Coupon.findById(id).lean();

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error(
      "Get coupon error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get coupon.",
    });
  }
};

// =====================================
// Update Coupon
// PUT /api/coupons/:id
// =====================================

exports.updateCoupon = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ===================================
    // Validate ID
    // ===================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    // ===================================
    // Allowed Fields
    // ===================================

    const allowedFields = [
      "code",
      "description",
      "discountType",
      "discountValue",
      "minimumOrder",
      "maxDiscount",
      "expiryDate",
      "active",
      "usageLimit",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        updateData[field] =
          req.body[field];
      }
    }

    // ===================================
    // Nothing To Update
    // ===================================

    if (
      Object.keys(updateData).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No valid coupon fields provided.",
      });
    }

    // ===================================
    // Code
    // ===================================

    if (
      updateData.code !== undefined
    ) {
      const normalizedCode =
        normalizeCouponCode(
          updateData.code
        );

      if (!normalizedCode) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon code cannot be empty.",
        });
      }

      updateData.code =
        normalizedCode;

      const duplicate =
        await Coupon.findOne({
          code: normalizedCode,
          _id: {
            $ne: id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "A coupon with this code already exists.",
        });
      }
    }

    // ===================================
    // Discount Type
    // ===================================

    if (
      updateData.discountType !==
        undefined &&
      !["Percentage", "Flat"].includes(
        updateData.discountType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type.",
      });
    }

    // ===================================
    // Discount Value
    // ===================================

    if (
      updateData.discountValue !==
      undefined
    ) {
      if (
        !isValidNonNegativeNumber(
          updateData.discountValue
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount value must be a valid non-negative number.",
        });
      }

      updateData.discountValue =
        Number(
          updateData.discountValue
        );
    }

    // ===================================
    // Get Existing Coupon
    // ===================================

    const existingCoupon =
      await Coupon.findById(id);

    if (!existingCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    // ===================================
    // Validate Percentage
    // ===================================

    const finalDiscountType =
      updateData.discountType ??
      existingCoupon.discountType;

    const finalDiscountValue =
      updateData.discountValue ??
      existingCoupon.discountValue;

    if (
      finalDiscountType ===
        "Percentage" &&
      Number(finalDiscountValue) >
        MAX_PERCENTAGE_DISCOUNT
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100%.",
      });
    }

    // ===================================
    // Minimum Order
    // ===================================

    if (
      updateData.minimumOrder !==
      undefined
    ) {
      if (
        !isValidNonNegativeNumber(
          updateData.minimumOrder
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Minimum order must be a valid non-negative number.",
        });
      }

      updateData.minimumOrder =
        Number(
          updateData.minimumOrder
        );
    }

    // ===================================
    // Max Discount
    // ===================================

    if (
      updateData.maxDiscount !==
      undefined
    ) {
      if (
        !isValidNonNegativeNumber(
          updateData.maxDiscount
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum discount must be a valid non-negative number.",
        });
      }

      updateData.maxDiscount =
        Number(
          updateData.maxDiscount
        );
    }

    // ===================================
    // Usage Limit
    // ===================================

    if (
      updateData.usageLimit !==
      undefined
    ) {
      if (
        !Number.isInteger(
          Number(
            updateData.usageLimit
          )
        ) ||
        Number(
          updateData.usageLimit
        ) < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Usage limit must be a non-negative whole number.",
        });
      }

      const newUsageLimit =
        Number(
          updateData.usageLimit
        );

      if (
        newUsageLimit > 0 &&
        newUsageLimit <
          existingCoupon.usedCount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Usage limit cannot be lower than the current redemption count.",
        });
      }

      updateData.usageLimit =
        newUsageLimit;
    }

    // ===================================
    // Expiry Date
    // ===================================

    if (
      updateData.expiryDate !==
      undefined
    ) {
      const parsedExpiryDate =
        new Date(
          updateData.expiryDate
        );

      if (
        Number.isNaN(
          parsedExpiryDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid expiry date.",
        });
      }

      updateData.expiryDate =
        parsedExpiryDate;
    }

    // ===================================
    // Description
    // ===================================

    if (
      updateData.description !==
      undefined
    ) {
      updateData.description =
        typeof updateData.description ===
        "string"
          ? updateData.description.trim()
          : "";
    }

    // ===================================
    // Active
    // ===================================

    if (
      updateData.active !== undefined
    ) {
      updateData.active =
        updateData.active === true;
    }

    // ===================================
    // Update
    // ===================================

    const coupon =
      await Coupon.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Coupon updated successfully.",
      coupon,
    });
  } catch (error) {
    console.error(
      "Update coupon error:",
      error
    );

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A coupon with this code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to update coupon.",
    });
  }
};

// =====================================
// Delete Coupon
// DELETE /api/coupons/:id
// =====================================

exports.deleteCoupon = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ===================================
    // Validate ID
    // ===================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    // ===================================
    // Find Coupon
    // ===================================

    const coupon =
      await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    // ===================================
    // Delete
    // ===================================

    await coupon.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Coupon deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete coupon error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to delete coupon.",
    });
  }
};

// =====================================
// Apply / Preview Coupon
// POST /api/coupons/apply
// =====================================

exports.applyCoupon = async (
  req,
  res
) => {
  try {
    const { code, subtotal } =
      req.body;

    // ===================================
    // Validate Code
    // ===================================

    const normalizedCode =
      normalizeCouponCode(code);

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon code is required.",
      });
    }

    // ===================================
    // Validate Subtotal
    // ===================================

    const numericSubtotal =
      Number(subtotal);

    if (
      !Number.isFinite(
        numericSubtotal
      ) ||
      numericSubtotal < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid subtotal is required.",
      });
    }

    // ===================================
    // Find Coupon
    // ===================================

    await ensureStorefrontCoupons();

    const coupon =
      await Coupon.findOne({
        code: normalizedCode,
        active: true,
      });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon.",
      });
    }

    // ===================================
    // Expiry
    // ===================================

    if (
      !coupon.expiryDate ||
      new Date(coupon.expiryDate) <=
        new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon has expired.",
      });
    }

    // ===================================
    // Usage Limit
    // ===================================

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

    // ===================================
    // Already Used By User
    // ===================================

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

    // ===================================
    // Minimum Order
    // ===================================

    const minimumOrder =
      Number(
        coupon.minimumOrder || 0
      );

    if (
      numericSubtotal <
      minimumOrder
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Minimum order amount is ₹${minimumOrder}.`,
      });
    }

    // ===================================
    // Calculate Discount
    // ===================================

    const discountValue =
      Number(
        coupon.discountValue || 0
      );

    let discount = 0;

    // ===================================
    // Percentage
    // ===================================

    if (
      coupon.discountType ===
      "Percentage"
    ) {
      discount =
        (numericSubtotal *
          discountValue) /
        100;

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

    // ===================================
    // Flat
    // ===================================

    else if (
      coupon.discountType ===
      "Flat"
    ) {
      discount = discountValue;
    }

    // ===================================
    // Invalid Type
    // ===================================

    else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid coupon discount type.",
      });
    }

    // ===================================
    // Safety Limit
    // ===================================

    discount = Math.min(
      Math.max(discount, 0),
      numericSubtotal
    );

    discount = Math.round(
      discount * 100
    ) / 100;

    const finalAmount = Math.max(
      numericSubtotal - discount,
      0
    );

    // ===================================
    // Response
    // ===================================

    return res.status(200).json({
      success: true,

      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description:
          coupon.description,
        discountType:
          coupon.discountType,
        discountValue:
          coupon.discountValue,
        minimumOrder:
          coupon.minimumOrder,
        maxDiscount:
          coupon.maxDiscount,
        expiryDate:
          coupon.expiryDate,
      },

      subtotal: numericSubtotal,

      discount,

      finalAmount,
    });
  } catch (error) {
    console.error(
      "Apply coupon error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to apply coupon.",
    });
  }
};

// =====================================
// Coupon Analytics
// GET /api/coupons/analytics
// =====================================

exports.getCouponAnalytics =
  async (req, res) => {
    try {
      const coupons =
        await Coupon.find().lean();

      const now = new Date();

      // =================================
      // Total Coupons
      // =================================

      const totalCoupons =
        coupons.length;

      // =================================
      // Active Coupons
      // =================================

      const activeCoupons =
        coupons.filter(
          (coupon) =>
            coupon.active === true &&
            new Date(
              coupon.expiryDate
            ) > now
        ).length;

      // =================================
      // Expired Coupons
      // =================================

      const expiredCoupons =
        coupons.filter(
          (coupon) =>
            new Date(
              coupon.expiryDate
            ) <= now
        ).length;

      // =================================
      // Total Redemptions
      // =================================

      const totalRedemptions =
        coupons.reduce(
          (sum, coupon) =>
            sum +
            Number(
              coupon.usedCount || 0
            ),
          0
        );

      // =================================
      // Most Used Coupon
      // =================================

      const mostUsedCoupon =
        coupons.length > 0
          ? coupons.reduce(
              (previous, current) =>
                Number(
                  current.usedCount || 0
                ) >
                Number(
                  previous.usedCount || 0
                )
                  ? current
                  : previous
            )
          : null;

      return res.status(200).json({
        success: true,

        analytics: {
          totalCoupons,

          activeCoupons,

          expiredCoupons,

          totalRedemptions,

          mostUsedCoupon,
        },
      });
    } catch (error) {
      console.error(
        "Coupon analytics error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to get coupon analytics.",
      });
    }
  };