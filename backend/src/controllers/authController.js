const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const EmailVerification = require("../models/EmailVerification");

const {
  sendEmailOTP,
  sendMobileOTP,
} = require("../services/otpService");

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    // =====================================
    // Validate input
    // =====================================

    if (
      !name ||
      !email ||
      !mobile ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, mobile and password are required",
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail =
      email.trim().toLowerCase();
    const trimmedMobile = mobile.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters",
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (!/^[6-9]\d{9}$/.test(trimmedMobile)) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid 10-digit Indian mobile number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // =====================================
    // Check existing email
    // =====================================

    const emailExists = await User.findOne({
      email: normalizedEmail,
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // =====================================
    // Check existing mobile
    // =====================================

    const mobileExists = await User.findOne({
      mobile: trimmedMobile,
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // =====================================
    // Hash password
    // =====================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =====================================
    // Create unverified user
    // =====================================

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      mobile: trimmedMobile,
      password: hashedPassword,
      isEmailVerified: false,
      isMobileVerified: false,
    });

    // =====================================
    // Remove old verification requests
    // =====================================

    await EmailVerification.deleteMany({
      user: user._id,
    });

    // =====================================
    // Generate 6-digit OTP
    // =====================================

    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // =====================================
    // Hash OTP
    // =====================================

    const otpHash =
      await bcrypt.hash(otp, 10);

    // =====================================
    // OTP expires in 10 minutes
    // =====================================

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await EmailVerification.create({
      user: user._id,
      otpHash,
      expiresAt,
      attempts: 0,
      verified: false,
      used: false,
    });

    // =====================================
    // Send verification email
    // =====================================

    try {
      await sendEmailOTP(
        user.email,
        otp,
        "registration"
      );
    } catch (deliveryError) {
      // Remove user if OTP could not be sent
      await EmailVerification.deleteMany({
        user: user._id,
      });

      await User.deleteOne({
        _id: user._id,
      });

      console.error(
        "Registration OTP delivery error:",
        deliveryError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification OTP right now. Please try again later.",
      });
    }

    // =====================================
    // Registration successful,
    // verification still required
    // =====================================

    return res.status(201).json({
      success: true,
      requiresEmailVerification: true,
      message:
        "Registration successful. Please verify your email with the OTP sent to you.",
      email: user.email,
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

exports.login = async (req, res) => {
  try {
    const rawIdentifier =
      req.body.identifier ||
      req.body.email ||
      req.body.mobile;
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email/mobile and password are required",
      });
    }

    const identifier =
      String(rawIdentifier).trim();

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        {
          email: identifier.toLowerCase(),
        },
        {
          mobile: identifier,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password",
      });
    }

    // Compare password first
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password",
      });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        requiresEmailVerification: true,
        email: user.email,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        district: user.district || "",
        state: user.state || "",
        country: user.country || "India",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
*/

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      mobile,
      dateOfBirth,
      district,
      state,
      country,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate name
    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      if (trimmedName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Name must contain at least 2 characters",
        });
      }

      user.name = trimmedName;
    }

    // Validate mobile
    if (mobile !== undefined) {
      const trimmedMobile = mobile.trim();

      if (!/^[6-9]\d{9}$/.test(trimmedMobile)) {
        return res.status(400).json({
          success: false,
          message:
            "Enter a valid 10-digit Indian mobile number",
        });
      }

      // Check whether another user already has this mobile
      const mobileExists = await User.findOne({
        mobile: trimmedMobile,
        _id: { $ne: user._id },
      });

      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number already exists",
        });
      }

      user.mobile = trimmedMobile;
    }

    // Date of Birth
    if (dateOfBirth !== undefined) {
      user.dateOfBirth =
        dateOfBirth || null;
    }

    // District, State, Country
    if (district !== undefined) {
      user.district = typeof district === "string" ? district.trim() : "";
    }
    if (state !== undefined) {
      user.state = typeof state === "string" ? state.trim() : "";
    }
    if (country !== undefined) {
      user.country = typeof country === "string" && country.trim() ? country.trim() : "India";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        district: user.district || "",
        state: user.state || "",
        country: user.country || "India",
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

exports.changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    // Prevent using the same password
    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Forgot Password - Send OTP
|--------------------------------------------------------------------------
*/

exports.forgotPassword = async (req, res) => {
  try {
    const {
      method,
      identifier,
    } = req.body;

    /*
     * Always return a generic response for
     * account lookup failures so we don't
     * reveal whether an account exists.
     */
    const genericMessage =
      "If an account exists, a verification OTP has been sent.";

    // Validate method
    if (!["email", "mobile"].includes(method)) {
      return res.status(400).json({
        success: false,
        message:
          "Recovery method must be email or mobile",
      });
    }

    if (
      typeof identifier !== "string" ||
      !identifier.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile is required",
      });
    }

    let user;

    // =====================================
    // Email recovery
    // =====================================

    if (method === "email") {
      const email =
        identifier.trim().toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid email address",
        });
      }

      user = await User.findOne({ email });
    }

    // =====================================
    // Mobile recovery
    // =====================================

    if (method === "mobile") {
      const mobile =
        identifier.trim();

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({
          success: false,
          message:
            "Enter a valid 10-digit Indian mobile number",
        });
      }

      user = await User.findOne({ mobile });
    }

    /*
     * Don't reveal whether the account exists.
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    // =====================================
    // Prevent rapid OTP requests
    // =====================================

    const recentReset =
      await PasswordReset.findOne({
        user: user._id,
        method,
      }).sort({ createdAt: -1 });

    if (recentReset) {
      const secondsSinceCreation =
        (Date.now() -
          recentReset.createdAt.getTime()) /
        1000;

      if (secondsSinceCreation < 60) {
        return res.status(200).json({
          success: true,
          message: genericMessage,
        });
      }
    }

    // Remove previous reset requests
    await PasswordReset.deleteMany({
      user: user._id,
      method,
    });

    // =====================================
    // Generate 6-digit OTP
    // =====================================

    const otp =
      crypto.randomInt(
        100000,
        1000000
      ).toString();

    // Hash OTP before storing
    const otpHash =
      await bcrypt.hash(otp, 10);

    // OTP expires in 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await PasswordReset.create({
      user: user._id,
      method,
      otpHash,
      expiresAt,
      attempts: 0,
      verified: false,
      used: false,
    });

    try {
      // Send OTP
      if (method === "email") {
        await sendEmailOTP(
          user.email,
          otp
        );
      } else {
        await sendMobileOTP(
          user.mobile,
          otp
        );
      }
    } catch (deliveryError) {
      // Remove unusable reset request
      await PasswordReset.deleteMany({
        user: user._id,
        method,
      });

      console.error(
        "OTP delivery error:",
        deliveryError
      );

      /*
       * Don't expose provider configuration
       * or internal delivery details.
       */
      return res.status(500).json({
        success: false,
        message:
          "Unable to send OTP right now. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Verify Password Reset OTP
|--------------------------------------------------------------------------
*/

exports.verifyResetOTP = async (req, res) => {
  try {
    const {
      method,
      identifier,
      otp,
    } = req.body;

    if (!["email", "mobile"].includes(method)) {
      return res.status(400).json({
        success: false,
        message:
          "Recovery method must be email or mobile",
      });
    }

    if (
      typeof identifier !== "string" ||
      !identifier.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email or mobile is required",
      });
    }

    if (
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter the 6-digit OTP",
      });
    }

    let user;

    if (method === "email") {
      const email =
        identifier.trim().toLowerCase();

      user = await User.findOne({
        email,
      });
    } else {
      const mobile =
        identifier.trim();

      user = await User.findOne({
        mobile,
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTP",
      });
    }

    const resetRequest =
      await PasswordReset.findOne({
        user: user._id,
        method,
        used: false,
      }).sort({ createdAt: -1 });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTP",
      });
    }

    // Check expiration
    if (
      resetRequest.expiresAt.getTime() <
      Date.now()
    ) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // OTP already verified
    if (resetRequest.verified) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has already been verified",
      });
    }

    // Maximum attempts
    if (resetRequest.attempts >= 5) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // Compare entered OTP with hash
    const isMatch =
      await bcrypt.compare(
        otp,
        resetRequest.otpHash
      );

    if (!isMatch) {
      resetRequest.attempts += 1;

      await resetRequest.save();

      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });
    }

    // Mark OTP as verified
    resetRequest.verified = true;

    await resetRequest.save();

    /*
     * Short-lived reset token.
     *
     * This token alone isn't enough:
     * resetPassword also checks the
     * PasswordReset record.
     */
    const resetToken = jwt.sign(
      {
        id: user._id.toString(),
        purpose: "password-reset",
        method,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error(
      "Verify OTP error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to verify OTP",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

exports.resetPassword = async (req, res) => {
  try {
    const {
      resetToken,
      newPassword,
      confirmPassword,
    } = req.body;

    // Validate input
    if (
      !resetToken ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token and password fields are required",
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // Confirm password
    if (
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // =====================================
    // Verify reset token
    // =====================================

    let decoded;

    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET
      );
    } catch (tokenError) {
      return res.status(400).json({
        success: false,
        message:
          "Reset session has expired. Please request a new OTP.",
      });
    }

    if (
      decoded.purpose !==
      "password-reset"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid password reset token",
      });
    }

    // Find user
    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset request",
      });
    }

    // =====================================
    // Verify reset request
    // =====================================

    const resetRequest =
      await PasswordReset.findOne({
        user: user._id,
        method: decoded.method,
        verified: true,
        used: false,
      }).sort({ createdAt: -1 });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message:
          "Reset request is invalid or has already been used",
      });
    }

    // Check OTP/reset expiry
    if (
      resetRequest.expiresAt.getTime() <
      Date.now()
    ) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "Reset request has expired. Please request a new OTP.",
      });
    }

    // =====================================
    // Prevent same password
    // =====================================

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // =====================================
    // Hash new password
    // =====================================

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    await user.save();

    // =====================================
    // Invalidate reset request
    // =====================================

    resetRequest.used = true;

    await resetRequest.save();

    // Invalidate any other reset requests
    await PasswordReset.deleteMany({
      user: user._id,
      _id: {
        $ne: resetRequest._id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to reset password",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Verify Registration Email OTP
|--------------------------------------------------------------------------
*/

exports.verifyRegistrationOTP = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    // =====================================
    // Validate input
    // =====================================

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter the 6-digit OTP",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // =====================================
    // Find user
    // =====================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification OTP",
      });
    }

    // =====================================
    // Already verified
    // =====================================

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already verified",
      });
    }

    // =====================================
    // Find verification request
    // =====================================

    const verification =
      await EmailVerification.findOne({
        user: user._id,
        used: false,
      }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification OTP",
      });
    }

    // =====================================
    // Check expiration
    // =====================================

    if (
      verification.expiresAt.getTime() <
      Date.now()
    ) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // =====================================
    // Maximum attempts
    // =====================================

    if (verification.attempts >= 5) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // =====================================
    // Verify OTP
    // =====================================

    const isMatch =
      await bcrypt.compare(
        otp,
        verification.otpHash
      );

    if (!isMatch) {
      verification.attempts += 1;

      await verification.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // =====================================
    // Mark email as verified
    // =====================================

    user.isEmailVerified = true;

    await user.save();

    // =====================================
    // Mark verification as used
    // =====================================

    verification.verified = true;
    verification.used = true;

    await verification.save();

    // =====================================
    // Remove any other verification records
    // =====================================

    await EmailVerification.deleteMany({
      user: user._id,
      _id: {
        $ne: verification._id,
      },
    });

    // =====================================
    // Success
    // =====================================

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully. You can now login.",
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
      "Registration OTP verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to verify email OTP",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Resend Registration Email OTP
|--------------------------------------------------------------------------
*/

exports.resendRegistrationOTP = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    // =====================================
    // Validate email
    // =====================================

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // =====================================
    // Find user
    // =====================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to resend verification OTP.",
      });
    }

    // =====================================
    // Already verified
    // =====================================

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    // =====================================
    // Find latest verification request
    // =====================================

    const latestVerification =
      await EmailVerification.findOne({
        user: user._id,
      }).sort({ createdAt: -1 });

    // =====================================
    // Resend cooldown: 60 seconds
    // =====================================

    if (latestVerification) {
      const secondsSinceLastOTP =
        (Date.now() -
          latestVerification.createdAt.getTime()) /
        1000;

      if (secondsSinceLastOTP < 60) {
        const remainingSeconds = Math.ceil(
          60 - secondsSinceLastOTP
        );

        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
        });
      }
    }

    // =====================================
    // Generate new 6-digit OTP
    // =====================================

    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // =====================================
    // Hash OTP
    // =====================================

    const otpHash =
      await bcrypt.hash(otp, 10);

    // =====================================
    // New OTP expires in 10 minutes
    // =====================================

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // =====================================
    // Remove old verification requests
    // =====================================

    await EmailVerification.deleteMany({
      user: user._id,
    });

    // =====================================
    // Create new verification request
    // =====================================

    await EmailVerification.create({
      user: user._id,
      otpHash,
      expiresAt,
      attempts: 0,
      verified: false,
      used: false,
    });

    // =====================================
    // Send new OTP email
    // =====================================

    try {
      await sendEmailOTP(
        user.email,
        otp,
        "registration"
      );
    } catch (deliveryError) {
      await EmailVerification.deleteMany({
        user: user._id,
      });

      console.error(
        "Resend registration OTP delivery error:",
        deliveryError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification OTP right now. Please try again later.",
      });
    }

    // =====================================
    // Success
    // =====================================

    return res.status(200).json({
      success: true,
      message:
        "A new verification OTP has been sent to your email.",
    });
  } catch (error) {
    console.error(
      "Resend registration OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to resend verification OTP.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Google OAuth Login / Registration
|--------------------------------------------------------------------------
*/
exports.googleLogin = async (req, res) => {
  try {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      return res.status(400).json({
        success: false,
        message: "Google credential token is required.",
      });
    }

    let payload;

    if (credential) {
      // 1. Verify ID Token using Google tokeninfo API
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );

      if (!response.ok) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired Google credential.",
        });
      }

      payload = await response.json();
    } else if (accessToken) {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        return res.status(401).json({
          success: false,
          message: "Invalid Google access token.",
        });
      }

      payload = await response.json();
    }

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account did not return an email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find or create user in MongoDB
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    if (user) {
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsSave = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        needsSave = true;
      }
      if (!user.isEmailVerified && email_verified) {
        user.isEmailVerified = true;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || "SilkVerse Customer",
        email: normalizedEmail,
        googleId,
        avatar: picture || null,
        authProvider: "google",
        isEmailVerified: email_verified !== false,
      });
    }

    // 3. Generate SilkVerse JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "silkverse-jwt-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Google authentication failed.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Demo Social Login (Allows testing social login before credentials setup)
|--------------------------------------------------------------------------
*/
exports.demoSocialLogin = async (req, res) => {
  try {
    const { provider = "google" } = req.body;

    const mockProfiles = {
      google: {
        name: "Ananya Sharma (Google User)",
        email: "ananya.google@silkverse-demo.com",
        googleId: "google-demo-1092837465",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
      facebook: {
        name: "Priya Reddy (Facebook User)",
        email: "priya.facebook@silkverse-demo.com",
        facebookId: "fb-demo-987654321",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      },
      apple: {
        name: "Kavya Iyer (Apple User)",
        email: "kavya.apple@silkverse-demo.com",
        appleId: "apple-demo-456789012",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
    };

    const profile = mockProfiles[provider] || mockProfiles.google;

    let user = await User.findOne({ email: profile.email });

    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        authProvider: provider,
        googleId: profile.googleId || undefined,
        facebookId: profile.facebookId || undefined,
        appleId: profile.appleId || undefined,
        avatar: profile.avatar,
        isEmailVerified: true,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "silkverse-jwt-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Demo social login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Demo social login failed.",
    });
  }
};

// @desc    Facebook OAuth Login & Registration
// @route   POST /api/auth/facebook
// @access  Public
exports.facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Facebook access token is required.",
      });
    }

    // 1. Verify token with Facebook Graph API
    const graphResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,first_name,last_name,email,picture.width(200).height(200)&access_token=${encodeURIComponent(
        accessToken
      )}`
    );

    if (!graphResponse.ok) {
      const errData = await graphResponse.json().catch(() => ({}));
      return res.status(401).json({
        success: false,
        message:
          errData?.error?.message || "Invalid or expired Facebook access token.",
      });
    }

    const fbData = await graphResponse.json();
    const facebookId = fbData.id;
    const name = fbData.name || "Facebook Customer";
    const email = fbData.email
      ? fbData.email.toLowerCase().trim()
      : `fb_${facebookId}@silkverse-social.com`;
    const avatar = fbData.picture?.data?.url || null;

    // 2. Find or create user
    let user = await User.findOne({
      $or: [{ facebookId }, { email }],
    });

    if (user) {
      let needsSave = false;
      if (!user.facebookId) {
        user.facebookId = facebookId;
        needsSave = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        facebookId,
        avatar,
        authProvider: "facebook",
        isEmailVerified: Boolean(fbData.email),
      });
    }

    // 3. Issue JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "silkverse-jwt-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        role: user.role,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Facebook Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during Facebook authentication.",
    });
  }
};

// @desc    Apple Sign-In Login & Registration
// @route   POST /api/auth/apple
// @access  Public
exports.appleLogin = async (req, res) => {
  try {
    const { id_token, user: userProfile } = req.body;

    if (!id_token) {
      return res.status(400).json({
        success: false,
        message: "Apple ID token is required.",
      });
    }

    // 1. Decode Apple ID token (JWT)
    const decoded = jwt.decode(id_token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid Apple identity token format.",
      });
    }

    // Check expiration if present
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({
        success: false,
        message: "Apple identity token has expired.",
      });
    }

    const appleId = decoded.sub;
    const email = decoded.email
      ? decoded.email.toLowerCase().trim()
      : `apple_${appleId.slice(0, 10)}@silkverse-social.com`;

    let name = "Apple Customer";
    if (userProfile?.name) {
      const parts = [userProfile.name.firstName, userProfile.name.lastName].filter(Boolean);
      if (parts.length > 0) name = parts.join(" ");
    }

    // 2. Find or create user
    let user = await User.findOne({
      $or: [{ appleId }, { email }],
    });

    if (user) {
      let needsSave = false;
      if (!user.appleId) {
        user.appleId = appleId;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        appleId,
        authProvider: "apple",
        isEmailVerified: Boolean(decoded.email_verified),
      });
    }

    // 3. Issue JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "silkverse-jwt-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        role: user.role,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Apple Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during Apple authentication.",
    });
  }
};