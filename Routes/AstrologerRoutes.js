const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Configure Multer storage and file filtering
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if the file is either jpeg or png
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../Astrologer_Profile_Pic"));
    } else {
      cb(new Error("Invalid file type"), false); // Reject unsupported file types
    }
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the current date and time appended with the original filename
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const AstrologerController = require("../Controller/AstrologerController");
// const { registerValidator, loginValidation } = require("../helper/Validation.js");

// Route for astrologer registration
router.post(
  "/astrologer-register",
  AstrologerController.AstrologerRegister
);
router.post(
  "/astrologer-login",
  AstrologerController.AstrologerLogin
);
router.post(
  "/astrologer-otp-verification/:id",
  AstrologerController.otpVerification
);
router.patch(
  "/update-astrologer-profile/:slug",upload.single('image'),
  AstrologerController.updateAstrologer
);
router.get("/astrologer-data", AstrologerController.getAstrologer);
router.get("/astrologer/:slug", AstrologerController.getAstrologerProfile);
module.exports = router;
