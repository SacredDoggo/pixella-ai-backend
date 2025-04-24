import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt";

export const validateId: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const id = req.params.id;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }

        next();
    } catch (error) {
        res.sendStatus(500);
        return;
    }
}

export const isAuthenticated: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.sendStatus(401);
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        req.user = decoded;

        next();
    } catch (error) {
        res.sendStatus(500);
        return;
    }
}

export const isAccountOwner: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const id = req.params.id;

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