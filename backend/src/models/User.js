const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================
    // Basic Information
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: false,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    district: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    // =====================================
    // Authentication & OAuth
    // =====================================

    password: {
      type: String,
      required: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      default: "local",
    },

    googleId: {
      type: String,
      sparse: true,
    },

    facebookId: {
      type: String,
      sparse: true,
    },

    appleId: {
      type: String,
      sparse: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    // =====================================
    // Role
    // =====================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =====================================
    // Verification
    // =====================================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique mobile number only when mobile is a non-empty string
// This allows social logins without mobile to exist without duplicate key error
userSchema.index(
  { mobile: 1 },
  {
    unique: true,
    partialFilterExpression: { mobile: { $type: "string", $gt: "" } },
  }
);

module.exports = mongoose.model("User", userSchema);