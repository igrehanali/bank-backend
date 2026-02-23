import { Router } from "express";
import authmiddleware from "../middleware/auth.middleware.js";
import createTransaction from "../controller/transaction.controller.js";
const transactionRouter = Router();

//  swagger documentation for create transaction endpoint
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - fromAccount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               fromAccount:
 *                 type: string
 *                 example: 60d5f9b8c2a1a2b3c4d5e6f7
 *               toAccount:
 *                 type: string
 *                 example: 60d5f9b8c2a1a2b3c4d5e6f8
 *               idempotencyKey:
 *                 type: string
 *                 example: "unique-key-12345"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: One or both accounts not found
 *       403:
 *         description: One or both accounts are not active
 *       409:
 *         description: Idempotency key conflict
 */

transactionRouter.post("/", authmiddleware, createTransaction);

export default transactionRouter;
