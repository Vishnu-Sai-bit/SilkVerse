const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleLogin,
  facebookLogin,
  appleLogin,
  demoSocialLogin,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  verifyRegistrationOTP,
  resendRegistrationOTP,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/apple", appleLogin);
router.post("/demo-social", demoSocialLogin);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

router.post(
  "/verify-registration-otp",
  verifyRegistrationOTP
);

router.post(
  "/resend-registration-otp",
  resendRegistrationOTP
);

router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;