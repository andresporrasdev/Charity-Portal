const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/check", userController.checkMembershipUser);

// To protect router, will use authController.protect as middleware
router.get("/userinfo", authController.protect, userController.getUserInfo);

// To restrict router for the certain role, will use authController.restrict as middleware
//router.delete("/delete", (authController.protect, authController.restrict("admin"), userController.deleteUser));

module.exports = router;
