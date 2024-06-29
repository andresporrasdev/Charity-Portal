const express = require("express");
const eventController = require("../controllers/eventController");
const router = express.Router();

router.get("/readEvent", eventController.getAllEvents);
router.post("/addEvent", eventController.addEvent);
router.post("/updateEvent", eventController.updateEvent);
router.get("/deleteEvent/:id", eventController.deleteEvent);
router.get("/getEventById/:id", eventController.getEventById);

module.exports = router;