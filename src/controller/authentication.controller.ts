import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

import { prisma } from "../config/prisma.config";
import SecretConfig from "../config/secrets.config";
import { logger } from "../util/logger";
import { LogConstants } from "../constant/log.constant";

export const register: express.RequestHandler = async (req: express.Request, res: express.Response) => {
    logger.info(`${LogConstants.FLOW.ENTERING} [register] Controller invoked`);

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
        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.user.findFirst] Checking if user exists`, { username, email });
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
        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.user.create] Creating new user`, { username, email });
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

        logger.info(`${LogConstants.FLOW.COMPLETED} [register] Controller completed successfully`, { userId: user.id, username: user.username, email: user.email });

        res.sendStatus(201);
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [register] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const login: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [login] Controller invoked`);

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
        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.user.findUnique] Finding user by identifier`, { identifier });
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

        const token = jwt.sign( // Payload, Secret, Options
            {
                userId: user.id,
                username: user.username,
                email: user.email
            },
            SecretConfig.jwtSecret as string,
            { expiresIn: SecretConfig.jwtExpiresIn } as SignOptions
        );

        logger.info(`${LogConstants.FLOW.COMPLETED} [login] Controller completed successfully`, { userId: user.id, username: user.username, email: user.email });

        res.cookie('token', token, {
            httpOnly: true,      // JS cannot read
            secure: true,        // Only over HTTPS
            sameSite: 'strict',     // Adjust for your needs
            maxAge: SecretConfig.cookieMaxAge,
            path: '/',           // Entire site
        }).json({ user: { id: user.id, username: user.username, email: user.email }, token: token });

        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [login] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const logout: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [logout] Controller invoked`);

    try {
        logger.info(`${LogConstants.FLOW.COMPLETED} [logout] Controller completed successfully`);
        res
            .clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 1 * 60 * 60 * 1000, // 1 hour
                path: '/',
            })
            .sendStatus(200);
            return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [logout] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
};