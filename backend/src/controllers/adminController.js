const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");

// ======================================
// Dashboard Statistics
// GET /api/admin/dashboard
// ======================================

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const pendingOrders =
      await Order.countDocuments({
        orderStatus: "Pending",
      });

    const shippedOrders =
      await Order.countDocuments({
        orderStatus: "Shipped",
      });

    const deliveredOrders =
      await Order.countDocuments({
        orderStatus: "Delivered",
      });

    const cancelledOrders =
      await Order.countDocuments({
        orderStatus: "Cancelled",
      });

    // ======================================
    // Revenue
    // Only successfully paid orders
    // Cancelled and refunded orders excluded
    // ======================================

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].revenue
        : 0;

    res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Orders
// GET /api/admin/orders
// ======================================

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate("address")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Order
// GET /api/admin/orders/:id
// ======================================

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email mobile"
      )
      .populate("address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Order Status
// PATCH /api/admin/orders/:id
// ======================================

exports.updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderStatus } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    // ======================================
    // Validate Status
    // ======================================

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // ======================================
    // Find Order
    // ======================================

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ======================================
    // Prevent Changing Completed Orders
    // ======================================

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.orderStatus}`,
      });
    }

    // ======================================
    // COD Payment
    // Mark COD as Paid when Delivered
    // ======================================

    if (
      orderStatus === "Delivered" &&
      order.paymentMethod === "COD" &&
      order.paymentStatus === "Pending"
    ) {
      order.paymentStatus = "Paid";
    }

    // ======================================
    // Admin Cancellation: Restore Stock & Coupon
    // ======================================

    if (orderStatus === "Cancelled") {
      if (order.paymentStatus === "Paid" && order.paymentMethod !== "COD") {
        order.paymentStatus = "Refunded";
      }

      if (!order.stockRestored) {
        const claimed = await Order.findOneAndUpdate(
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

        if (claimed) {
          for (const item of order.items || []) {
            const productId = item?.product?._id || item?.product;
            const quantity = Number(item?.quantity);

            if (
              productId &&
              mongoose.Types.ObjectId.isValid(productId) &&
              Number.isInteger(quantity) &&
              quantity > 0
            ) {
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
          order.stockRestored = true;
        }
      }

      if (order.couponCode && !order.couponRestored && order.user) {
        const normalizedCouponCode = order.couponCode
          .toString()
          .trim()
          .toUpperCase();

        const restoredCoupon = await Coupon.findOneAndUpdate(
          {
            code: normalizedCouponCode,
            usedCount: { $gt: 0 },
            usedBy: order.user,
          },
          {
            $inc: { usedCount: -1 },
            $pull: { usedBy: order.user },
          },
          { new: true }
        );

        order.couponRestored = Boolean(restoredCoupon);
      }
    }

    // ======================================
    // Update Order Status
    // ======================================

    order.orderStatus =
      orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        orderStatus === "Cancelled"
          ? "Order cancelled and product stock restored successfully"
          : "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Products
// GET /api/admin/products
// ======================================

exports.getAllProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find()
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get all products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Product
// GET /api/admin/products/:id
// ======================================

exports.getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Create Product
// POST /api/admin/products
// ======================================

exports.createProduct = async (
  req,
  res
) => {
  try {
    let image = "";
    let images = [];

    // ======================================
    // Multiple Uploaded Images
    // Maximum 6 images
    // ======================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      images = req.files.map(
        (file) =>
          `/uploads/products/${file.filename}`
      );

      // First image = cover image
      image = images[0];
    }

    // ======================================
    // Manual Image Path
    // ======================================

    if (
      !image &&
      req.body.image
    ) {
      image =
        req.body.image;

      images = [
        req.body.image,
      ];
    }

    // ======================================
    // Validate Required Fields
    // ======================================

    if (
      !req.body.name ||
      !req.body.category ||
      req.body.price ===
        undefined ||
      req.body.stock ===
        undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, price and stock are required.",
      });
    }

    const name =
      req.body.name.trim();

    const category =
      req.body.category.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required.",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Product category is required.",
      });
    }

    const price =
      Number(req.body.price);

    const stock =
      Number(req.body.stock);

    // ======================================
    // Validate Price
    // ======================================

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product price.",
      });
    }

    // ======================================
    // Validate Stock
    // ======================================

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product stock.",
      });
    }

    // ======================================
    // Create Product
    // ======================================

    let parsedViews = undefined;
    if (req.body.views) {
      try {
        parsedViews = typeof req.body.views === "string" ? JSON.parse(req.body.views) : req.body.views;
      } catch (e) {
        parsedViews = req.body.views;
      }
    }

    const product =
      await Product.create({
        name,
        description:
          req.body.description ||
          "",
        category,
        price,
        stock,
        image,
        images,
        ...(parsedViews ? { views: parsedViews } : {}),
      });

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Product
// PUT /api/admin/products/:id
// ======================================

exports.updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ======================================
    // Validate Required Fields
    // ======================================

    if (
      !req.body.name ||
      !req.body.category ||
      req.body.price ===
        undefined ||
      req.body.stock ===
        undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, price and stock are required.",
      });
    }

    const name =
      req.body.name.trim();

    const category =
      req.body.category.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required.",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Product category is required.",
      });
    }

    const price =
      Number(req.body.price);

    const stock =
      Number(req.body.stock);

    // ======================================
    // Validate Price
    // ======================================

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product price.",
      });
    }

    // ======================================
    // Validate Stock
    // ======================================

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product stock.",
      });
    }

    // ======================================
    // Existing Images
    // ======================================

    let image =
      product.image || "";

    let images =
      product.images || [];

    // ======================================
    // New Images Uploaded
    // Replace Existing Gallery
    // ======================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      images = req.files.map(
        (file) =>
          `/uploads/products/${file.filename}`
      );

      image = images[0];
    }

    // ======================================
    // Manual Image Path
    // ======================================

    else if (
      req.body.image
    ) {
      image =
        req.body.image;

      images = [
        req.body.image,
      ];
    }

    // ======================================
    // Update Product
    // ======================================

    product.name = name;

    product.description =
      req.body.description ||
      "";

    product.category =
      category;

    product.price =
      price;

    product.stock =
      stock;

    product.image =
      image;

    product.images =
      images;

    if (req.body.views) {
      try {
        product.views =
          typeof req.body.views === "string"
            ? JSON.parse(req.body.views)
            : req.body.views;
      } catch (e) {
        product.views = req.body.views;
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Product
// DELETE /api/admin/products/:id
// ======================================

exports.deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Users
// GET /api/admin/users
// ======================================

exports.getAllUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update User Role
// PATCH /api/admin/users/:id/role
// ======================================

exports.updateUserRole = async (
  req,
  res
) => {
  try {
    const { role } =
      req.body;

    // ======================================
    // Validate Role
    // ======================================

    if (
      !["user", "admin"].includes(
        role
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ======================================
    // Find User
    // ======================================

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // Prevent Removing Own Admin Role
    // ======================================

    if (
      user._id.toString() ===
        req.user.id.toString() &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot remove your own admin role.",
      });
    }

    user.role =
      role;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete User
// DELETE /api/admin/users/:id
// ======================================

exports.deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // Prevent Deleting Yourself
    // ======================================

    if (
      user._id.toString() ===
      req.user.id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account.",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Analytics
// GET /api/admin/analytics
// ======================================

exports.getAnalytics = async (
  req,
  res
) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    // ======================================
    // Revenue
    // Only paid, non-cancelled orders
    // ======================================

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const revenue =
      revenueResult.length > 0
        ? revenueResult[0].revenue
        : 0;

    res.status(200).json({
      success: true,

      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
      },
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};