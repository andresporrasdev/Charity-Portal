const express = require("express");
//const { checkUser } = require("../controllers/userController");
const userController = require("../controllers/userController");

const router = express.Router();

//router.post("/check-and-save", userController);
router.post("/check", userController.checkUser);

module.exports = router;
