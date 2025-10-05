import express from "express";
import { login, logout, register } from "../controller/authentication.controller";

export default (router: express.Router) => {
    /**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernamePreCheck
 *               - emailPreCheck
 *               - passwordPreCheck
 *             properties:
 *               usernamePreCheck:
 *                 type: string
 *               emailPreCheck:
 *                 type: string
 *               passwordPreCheck:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  userId:
 *                      type: string
 *                  username:
*                       type: string
*                     email:
*                       type: string
 *       400:
 *         description: Bad request or validation error
 *       409:
 *         description: Duplicate user error
 */
    router.post("/auth/register", register);
    router.post("/auth/login", login);
    router.post("/auth/logout", logout);
}