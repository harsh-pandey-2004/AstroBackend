const express = require("express");
const router = express.Router();

router.use(express.json());

const path = require("path");

const userController = require("../Controller/userController");

// const { registerValidator, loginValidation } = require("../helper/Validation.js");

router.post("/register", userController.userRegister, userController.sendOtp);
router.post("/login", userController.loginUser);
router.post("/otp-verification/:id", userController.otpVerification);
router.get("/userDetails/:slug", userController.getuserData);
router.patch("/updateUserdata/:id", userController.UpdateUser);
router.patch("/deleteUserdata/:id", userController.DeleteUser);
module.exports = router;
