const express = require("express");
const router = express.Router();

router.use(express.json());

const path = require("path");

const userController = require("../Controller/userController");

const { registerValidator, loginValidation } = require("../helper/Validation.js");

router.post("/register", registerValidator, userController.userRegister);
router.post("/login", loginValidation, userController.loginUser);
router.post("/otp-verification/:id", userController.otpVerification);

router.get("/userDetails/:id", userController.getuserData);

module.exports = router;
