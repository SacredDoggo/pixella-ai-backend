import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma";

export const validateId: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const id = req.params.user_id || req.params.chat_id || req.params.message_id;

        // Check if the ID is a valid ObjectId
        if (!(typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id))) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }

        if (req.params.message_id) {
            const message = await prisma.message.findUnique({
                where: { id: req.params.message_id }
            });

            if (!message) {
                res.status(404).json({ error: "Message not found" });
                return;
            }
        }

        if (req.params.chat_id) {
            const chat = await prisma.chat.findUnique({
                where: { id: req.params.chat_id }
            });

            if (!chat) {
                res.status(404).json({ error: "Chat not found" });
                return;
            }
        }

        next();
    } catch (error) {
        res.sendStatus(500);
        return;
    }
}

export const isAuthenticated: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        // Get token from Authorization header: "Bearer <token>"
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Get the part after "Bearer"

        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
            if (err || !(user && typeof user === "object")) {
                res.status(403).json({ message: 'Invalid or expired token' });
                return;
            }

            if (!user.userId || !user.username || !user.email) {
                res.status(403).json({ message: 'Invalid token' });
                return;
            }

            req.user = user as JwtPayload; // user contains payload (userId, username, email, etc.)
            next();
        });

    } catch (error) {
        res.sendStatus(500);
        return;
    }
}

export const isAccountOwner: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const id = req.params.user_id;

        if (!req.user) {
            res.sendStatus(401);
            return;
        }

        const { userId } = req.user;

        if (!userId || userId != id) {
            res.sendStatus(401);
            return;
        }

        next();
    } catch (error) {
        res.sendStatus(500);
        return;
    }
}