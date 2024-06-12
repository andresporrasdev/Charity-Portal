const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/check", userController.checkMembershipUser);
router.post("/save", userController.saveUser);
router.post("/login", userController.login);
module.exports = router;
