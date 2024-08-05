const express = require("express");
const roleController = require("../controllers/roleController");
const router = express.Router();

router.get("/getAllRoles", roleController.getAllRoles);

module.exports = router;
