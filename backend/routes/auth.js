const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful — returns JWT token
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
