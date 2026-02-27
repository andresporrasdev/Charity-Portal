const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /event/readEvent:
 *   get:
 *     summary: Get all events (public)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 0, description: "0 = return all" }
 *     responses:
 *       200:
 *         description: List of events with pagination metadata
 */
// Public routes
router.get("/readEvent", eventController.getAllEvents);
router.get("/getEventById/:id", eventController.getEventById);

// Protected routes — Administrators and Organizers only
router.post(
  "/addEvent",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  eventController.addEvent
);

router.patch(
  "/updateEvent/:id",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  eventController.updateEvent
);

router.delete(
  "/deleteEvent/:id",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  eventController.deleteEvent
);

router.post(
  "/upload",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  eventController.upload.single("file"),
  eventController.multerErrorHandling,
  eventController.handleFileUpload
);

module.exports = router;
