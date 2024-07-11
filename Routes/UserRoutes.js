const express = require("express");
const router = express.Router();

router.use(express.json());

const path = require("path");

const userController = require("../Controller/userController");

// const { registerValidator, loginValidation } = require("../helper/Validation.js");

router.post("/register", userController.userRegister);
router.post("/login", userController.loginUser);
router.post("/otp-verification/:slug", userController.otpVerification);

router.get("/userDetails/:slug", userController.getuserData);

module.exports = router;
