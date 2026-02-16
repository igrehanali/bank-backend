import { Router } from "express";
import { userRegister, userLogin } from "../controller/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 */
router.post("/register", userRegister);
//  swagger documentation for login endpoint
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Login a user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                example: user@example.com
 *              password:
 *                type: string
 *                example: password123
 *    responses:
 *      200:
 *        description: User logged in successfully
 *      400:
 *        description: Invalid email or password
 * */

router.post("/login", userLogin);

export default router;
