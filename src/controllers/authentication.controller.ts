import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";

export const register: express.RequestHandler = async (req: express.Request, res: express.Response) => {
    try {
        // Check if there is an request body
        if (!req.body) {
            res.status(400).json({ error: "Bad Request: No body found" });
            return;
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: "Arguments missing!" });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            res.status(409).json({ error: "User already exists!" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and password hash in a transaction
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: {
                    create: {
                        hash: hashedPassword,
                    },
                },
            }
        });

        res.sendStatus(201);
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}

export const login: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Bad Request: No body found" });
            return;
        }

        const { identifier, password } = req.body;

        if (!identifier || !password) {
            res.status(400).json({ error: "Arguments missing!" })
        }

        // Find user by username or email, including their password hash
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ username: identifier }, { email: identifier }],
            },
            include: { password: true },
        });


        if (!user || !(user.password?.hash && await bcrypt.compare(password, user.password.hash))) {
            res.status(404).json({ error: "Invaid credentials!" });
            return;
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        res.status(200).json({ userId: user.id, username: user.username, email: user.email, token }).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}