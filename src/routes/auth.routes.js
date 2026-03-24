const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validations/auth.validation");
const { authLimiter, userLimiter } = require("../middlewares/rateLimit.middleware");
const router = express.Router();

// authLimiter only on /register — if router.use(authLimiter) ran before /login,
// a 429 from authLimiter would skip userLimiter entirely (no keyGenerator, no logs).

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", authLimiter, validate(registerSchema), authController.register);



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/login", userLimiter, validate(loginSchema), authController.login);

module.exports = router;
