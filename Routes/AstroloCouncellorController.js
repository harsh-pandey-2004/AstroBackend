const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Configure Multer storage and file filtering
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if the file is either jpeg or png
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../AstroloCouncellor_Profile_Pic"));
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

const AstrologerController = require("../Controller/AstroloCouncellorController");
const { registerValidator, loginValidation } = require("../helper/validation.js");

// Route for astrologer registration
router.post(
  "/astroCouncelor-register",
  registerValidator,
  AstrologerController.AstroCouncellorRegister
);
router.post(
  "/astroCouncelor-login",
  loginValidation,
  AstrologerController.AstroCouncellorLogin
);
router.post(
  "/astroCouncelor-otp-verification/:id",
  AstrologerController.otpVerification
);
router.patch(
  "/update-astroCouncelor-profile/:id",upload.single('image'),
  AstrologerController.updateAstroCouncellor
);
router.get("/astroCouncelor-data", AstrologerController.getAstroCouncellor);
router.get(
  "/astroCouncelor/:slug",
  AstrologerController.getAstroCouncellorProfile
);
module.exports = router;
