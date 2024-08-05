const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

// To protect router, will use authController.protect as middleware
router.get("/userinfo", authController.protect, userController.getUserInfo);

// Admin-protected routes for User CRUD
// To restrict router for the certain role, will use authController.restrict as middleware
router.get(
  "/getAllUsers",
  authController.protect,
  authController.restrict("Administrator"),
  userController.getAllUsers
);

router.get(
  "/getUsersByRoleId/:roleId",
  authController.protect,
  authController.restrict("Administrator"),
  userController.getUsersByRoleId
);

router.patch(
  "/updateUser/:id",
  authController.protect,
  authController.restrict("Administrator"),
  userController.updateUser
);

router.delete(
  "/deleteUser/:id",
  authController.protect,
  authController.restrict("Administrator"),
  userController.deleteUser
);

module.exports = router;
