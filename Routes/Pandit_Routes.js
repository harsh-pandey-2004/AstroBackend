const panditController = require("../Controller/PanditController");
const express = require("express");
const router = express.Router();
const path=require('path');
router.use(express.json());
// const { registerValidator, loginValidation } = require("../helper/Validation.js");
const multer = require("multer");

// Configure Multer storage and file filtering
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if the file is either jpeg or png
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../Pandit_Profile_Pic"));
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




router.post(
  "/pandit-registration",
  panditController.panditRegister
);
router.post(
  "/PanditBooking/user-deatils/:id",
  panditController.BookPanditwithPooja
);
router.get("/panditpooja", panditController.getpanditBypooja);
router.post("/loginpandit",panditController.loginpandit);
router.post(
  "/pandit-otp-verification/:id",
  panditController.otpVerificationPandit
);

router.patch("/update-pandit-profile/:slug", panditController.updatePandit);
router.get("/panditdata/:slug", panditController.getPanditById);
module.exports = router;
