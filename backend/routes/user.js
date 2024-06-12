const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/check", userController.checkMembershipUser);
router.post("/save", userController.saveUser);

module.exports = router;
