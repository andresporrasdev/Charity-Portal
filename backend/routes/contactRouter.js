const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

/**
 * @swagger
 * /contact/send-contact-email:
 *   post:
 *     summary: Send a contact form email
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               message: { type: string, maxLength: 2000 }
 *     responses:
 *       200:
 *         description: Emails sent successfully
 *       400:
 *         description: Validation error (missing fields, invalid email, message too long)
 *       429:
 *         description: Rate limit exceeded (5 per hour)
 */
router.post("/send-contact-email", contactController.sendContactEmail);

module.exports = router;
