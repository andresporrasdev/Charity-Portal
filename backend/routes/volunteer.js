const express = require("express");
const { get } = require("mongoose");
// const eventController = require("../controllers/eventController");
const volunteerController = require("../controllers/volunteerController");
const router = express.Router();

//in doubt
// router.post("/getUserInfo", volunteerController.getAllEvents);
// router.post("/getEvents", volunteerController.addEvent);

//Volunteer routes
router.post("/volunteerSignUp", volunteerController.volunteerSignUp);
router.get("/getAllVolunteers", volunteerController.getAllVolunteers);
module.exports = router;