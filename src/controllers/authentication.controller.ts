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

        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: "Arguments missing!" });
            return;
        }

        username = username.trim();
        email = email.trim();
        password = password.trim();

        if (password.length < 8) {
            res.status(400).json({ error: "Password must be at least 8 characters long!" });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ error: "Invalid email address!" });
            return;
        }

        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
            res.status(400).json({ error: "Username must be 3-30 characters long and can only contain letters, numbers, and underscores!" });
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
        console.error("Error during registration:", error);
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

        let { identifier, password } = req.body;

        if (!identifier || !password) {
            res.status(400).json({ error: "Arguments missing!" });
            return;
        }

        identifier = identifier.trim();
        password = password.trim();

        // Find user by username or email, including their password hash
        let user = null;
        if (identifier.includes("@")) {
            user = await prisma.user.findUnique({
                where: { email: identifier },
                include: { password: true },
            });
        } else {
            user = await prisma.user.findUnique({
                where: { username: identifier },
                include: { password: true },
            });
        }


        if (!user || !(user.password?.hash && await bcrypt.compare(password, user.password.hash))) {
            res.status(404).json({ error: "Invalid credentials!" });
            return;
        }

        if (!process.env.JWT_SECRET) {
            res.status(500).json({ error: "JWT secret is not configured on the server." });
            return;
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ userId: user.id, username: user.username, email: user.email, token }).end();
        return;
    } catch (error) {
        console.error("Error during login:", error);
        res.sendStatus(500);
        return;
    }
}