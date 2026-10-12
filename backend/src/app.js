const express = require("express");
const cors = require("cors");
const path = require("path");

// =====================================
// Routes
// =====================================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const addressRoutes = require("./routes/addressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const couponRoutes = require("./routes/couponRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// =====================================
// Middleware
// =====================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================
// Static Uploads
// =====================================

const uploadsPath = path.join(
  __dirname,
  "../uploads"
);

const imagesPath = path.join(
  __dirname,
  "../../frontend/public/images"
);

console.log(
  "📁 Serving uploads from:",
  uploadsPath
);
console.log(
  "📁 Serving images from:",
  imagesPath
);

app.use(
  "/uploads",
  express.static(uploadsPath)
);
app.use(
  "/uploads",
  express.static(path.join(imagesPath, "products"))
);

app.use(
  "/images",
  express.static(imagesPath)
);

// Health check endpoint for cloud monitoring & load balancers
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    app: "SilkVerse API",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// =====================================
// API Routes
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/addresses",
  addressRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/coupons",
  couponRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

// =====================================
// Health Check
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "SilkVerse API Running Successfully",
  });
});

// =====================================
// 404 Handler
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================
// Export App
// =====================================

module.exports = app;