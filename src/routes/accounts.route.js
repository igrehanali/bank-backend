import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createAccountController } from "../controller/account.controller.js";

const accountRouter = express.Router();

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account for the authenticated user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency:
 *                 type: string
 *                 example: USD
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
accountRouter.post("/", authMiddleware, createAccountController);

export default accountRouter;
