const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// Upload Directory
// ======================================

const uploadPath = "uploads/products";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ======================================
// Storage Configuration
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ======================================
// File Filter
// ======================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed."),
      false
    );
  }
};

// ======================================
// Multer Configuration
// ======================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    // Maximum 5 MB per image
    fileSize: 5 * 1024 * 1024,

    // Maximum 6 images
    files: 6,
  },
});

module.exports = upload;