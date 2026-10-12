const express = require("express");

const {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Protect All Address Routes
// =====================================

router.use(protect);

// =====================================
// Add Address
// POST /api/addresses
// =====================================

router.post("/", addAddress);

// =====================================
// Get All User Addresses
// GET /api/addresses
// =====================================

router.get("/", getAddresses);

// =====================================
// Get Single User Address
// GET /api/addresses/:id
// =====================================

router.get("/:id", getAddress);

// =====================================
// Update Address
// PUT /api/addresses/:id
// =====================================

router.put("/:id", updateAddress);

// =====================================
// Delete Address
// DELETE /api/addresses/:id
// =====================================

router.delete("/:id", deleteAddress);

// =====================================
// Set Default Address
// PATCH /api/addresses/:id/default
// =====================================

router.patch(
  "/:id/default",
  setDefaultAddress
);

module.exports = router;