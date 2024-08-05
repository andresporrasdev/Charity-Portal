const express = require("express");
const otpController = require("../controllers/otpController");
const router = express.Router();

router.post("/send-otp", otpController.sendOtp);

router.post("/verify-otp", otpController.verifyOtp);
module.exports = router;
