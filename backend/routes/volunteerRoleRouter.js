const express = require("express");
const VolunteerRoleController = require("../controllers/volunteerRoleController");

const router = express.Router();

router.get("/getAllVolunteerRoles", VolunteerRoleController.getAllVolunteerRole);

module.exports = router;