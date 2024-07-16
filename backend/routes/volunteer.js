const express = require("express");
const { get } = require("mongoose");
const authController = require("../controllers/authController");

// const eventController = require("../controllers/eventController");
const volunteerController = require("../controllers/volunteerController");
const router = express.Router();

// To restrict router for the certain role, will use authController.restrict as middleware

//Volunteer routes
router.post(
    "/volunteerSignUp",
    volunteerController.volunteerSignUp
);

router.get(
    "/getAllVolunteers", 
    authController.protect,
    authController.restrict("Administrator"),
    volunteerController.getAllVolunteers
);
router.patch(
    "/updateVolunteer/:id",
    authController.protect,
    authController.restrict("Administrator"),
    volunteerController.updateVolunteer
);

router.delete(
    "/deleteVolunteer/:id",
    authController.protect,
    authController.restrict("Administrator"),
    volunteerController.deleteVolunteer
);

module.exports = router;