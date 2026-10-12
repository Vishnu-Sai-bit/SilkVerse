const mongoose = require("mongoose");
const Address = require("../models/Address");

// =====================================
// Helper: Validate MongoDB ID
// =====================================

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// =====================================
// Helper: Validate Required Fields
// =====================================

function validateAddressFields(data) {
  const {
    fullName,
    mobile,
    pincode,
    houseNumber,
    area,
    city,
    state,
    country,
    addressType,
  } = data;

  if (
    typeof fullName !== "string" ||
    !fullName.trim()
  ) {
    return "Full name is required.";
  }

  if (
    typeof mobile !== "string" ||
    !/^[6-9]\d{9}$/.test(
      mobile.trim()
    )
  ) {
    return "Enter a valid 10-digit mobile number.";
  }

  if (
    typeof pincode !== "string" ||
    !/^\d{6}$/.test(
      pincode.trim()
    )
  ) {
    return "Enter a valid 6-digit pincode.";
  }

  if (
    typeof houseNumber !== "string" ||
    !houseNumber.trim()
  ) {
    return "House number is required.";
  }

  if (
    typeof area !== "string" ||
    !area.trim()
  ) {
    return "Area is required.";
  }

  if (
    typeof city !== "string" ||
    !city.trim()
  ) {
    return "City is required.";
  }

  if (
    typeof state !== "string" ||
    !state.trim()
  ) {
    return "State is required.";
  }

  if (
    typeof country !== "string" ||
    !country.trim()
  ) {
    return "Country is required.";
  }

  if (
    !["Home", "Work", "Other"].includes(
      addressType
    )
  ) {
    return "Address type must be Home, Work, or Other.";
  }

  return null;
}

// =====================================
// Helper: Prepare Address Data
// =====================================

function prepareAddressData(data) {
  return {
    fullName: data.fullName.trim(),

    mobile: data.mobile.trim(),

    pincode: data.pincode.trim(),

    houseNumber:
      data.houseNumber.trim(),

    area: data.area.trim(),

    landmark:
      typeof data.landmark === "string"
        ? data.landmark.trim()
        : "",

    city: data.city.trim(),

    district:
      typeof data.district === "string"
        ? data.district.trim()
        : "",

    state: data.state.trim(),

    country: data.country.trim(),

    addressType: data.addressType,

    isDefault:
      data.isDefault === true,
  };
}

// =====================================
// Add Address
// POST /api/addresses
// =====================================

exports.addAddress = async (
  req,
  res
) => {
  try {
    // ===================================
    // Authentication Check
    // ===================================

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ===================================
    // Validate Fields
    // ===================================

    const validationError =
      validateAddressFields(
        req.body
      );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const userId = req.user._id;

    const addressData =
      prepareAddressData(
        req.body
      );

    // ===================================
    // First Address Automatically Default
    // ===================================

    const addressCount =
      await Address.countDocuments({
        user: userId,
      });

    const shouldBeDefault =
      addressCount === 0 ||
      req.body.isDefault === true;

    // ===================================
    // Remove Existing Default
    // ===================================

    if (shouldBeDefault) {
      await Address.updateMany(
        {
          user: userId,
          isDefault: true,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    // ===================================
    // Create Address
    // ===================================

    const address =
      await Address.create({
        user: userId,

        ...addressData,

        isDefault:
          shouldBeDefault,
      });

    return res.status(201).json({
      success: true,
      message:
        "Address added successfully.",
      address,
    });
  } catch (error) {
    console.error(
      "Add address error:",
      error
    );

    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Unable to set this address as default. Please try again.",
      });
    }

    // Mongoose validation
    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to add address.",
    });
  }
};

// =====================================
// Get User Addresses
// GET /api/addresses
// =====================================

exports.getAddresses = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const addresses =
      await Address.find({
        user: req.user._id,
      }).sort({
        isDefault: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error(
      "Get addresses error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load addresses.",
    });
  }
};

// =====================================
// Get Single Address
// GET /api/addresses/:id
// =====================================

exports.getAddress = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid address ID.",
      });
    }

    const address =
      await Address.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message:
          "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(
      "Get address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load address.",
    });
  }
};

// =====================================
// Update Address
// PUT /api/addresses/:id
// =====================================

exports.updateAddress = async (
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
        message:
          "Invalid address ID.",
      });
    }

    // ===================================
    // Validate Fields
    // ===================================

    const validationError =
      validateAddressFields(
        req.body
      );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // ===================================
    // Find User Address
    // ===================================

    const address =
      await Address.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message:
          "Address not found.",
      });
    }

    const addressData =
      prepareAddressData(
        req.body
      );

    // ===================================
    // Determine Default Status
    // ===================================

    if (req.body.isDefault === true) {
      await Address.updateMany(
        {
          user: req.user._id,

          _id: {
            $ne: address._id,
          },

          isDefault: true,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );

      address.isDefault = true;
    } else if (
      req.body.isDefault === false &&
      address.isDefault === true
    ) {
      // =================================
      // Do Not Leave User Without Default
      // If Other Addresses Exist
      // =================================

      const otherAddressExists =
        await Address.exists({
          user: req.user._id,

          _id: {
            $ne: address._id,
          },
        });

      if (otherAddressExists) {
        return res.status(400).json({
          success: false,
          message:
            "Please set another address as default before removing the current default address.",
        });
      }

      address.isDefault = false;
    }

    // ===================================
    // Update Fields
    // ===================================

    address.fullName =
      addressData.fullName;

    address.mobile =
      addressData.mobile;

    address.pincode =
      addressData.pincode;

    address.houseNumber =
      addressData.houseNumber;

    address.area =
      addressData.area;

    address.landmark =
      addressData.landmark;

    address.city =
      addressData.city;

    address.district =
      addressData.district;

    address.state =
      addressData.state;

    address.country =
      addressData.country;

    address.addressType =
      addressData.addressType;

    // Only change isDefault when
    // explicitly supplied.
    if (
      req.body.isDefault === true
    ) {
      address.isDefault = true;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message:
        "Address updated successfully.",
      address,
    });
  } catch (error) {
    console.error(
      "Update address error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Unable to update default address. Please try again.",
      });
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update address.",
    });
  }
};

// =====================================
// Delete Address
// DELETE /api/addresses/:id
// =====================================

exports.deleteAddress = async (
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
        message:
          "Invalid address ID.",
      });
    }

    // ===================================
    // Find User Address
    // ===================================

    const address =
      await Address.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message:
          "Address not found.",
      });
    }

    // ===================================
    // Delete
    // ===================================

    await address.deleteOne();

    // ===================================
    // Promote Another Address
    // If Deleted Address Was Default
    // ===================================

    if (address.isDefault) {
      const nextAddress =
        await Address.findOne({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Address deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete address.",
    });
  }
};

// =====================================
// Set Default Address
// PATCH /api/addresses/:id/default
// =====================================

exports.setDefaultAddress = async (
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
        message:
          "Invalid address ID.",
      });
    }

    // ===================================
    // Find User Address
    // ===================================

    const address =
      await Address.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message:
          "Address not found.",
      });
    }

    // Already Default
    if (address.isDefault) {
      return res.status(200).json({
        success: true,
        message:
          "This address is already the default address.",
        address,
      });
    }

    // ===================================
    // Remove Existing Default
    // ===================================

    await Address.updateMany(
      {
        user: req.user._id,

        _id: {
          $ne: address._id,
        },

        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    // ===================================
    // Set Selected Address Default
    // ===================================

    address.isDefault = true;

    await address.save();

    return res.status(200).json({
      success: true,
      message:
        "Default address updated successfully.",
      address,
    });
  } catch (error) {
    console.error(
      "Set default address error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Unable to set default address. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to set default address.",
    });
  }
};