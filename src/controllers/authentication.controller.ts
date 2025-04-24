import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as _ from "lodash";

import { createUser, getUserByEmail, getUserByUsername } from "../db/users.db";

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

        const existingUserEmail = await getUserByEmail(email);
        if (existingUserEmail) {
            res.status(409).json({ error: "Email already exists." });
            return;
        }

        const existingUsername = await getUserByUsername(username);
        if (existingUsername) {
            res.status(409).json({ error: "Username already taken." });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await createUser({
            email,
            username,
            authentication: {
                password: hashedPassword,
                salt
            }
        });

        res.status(200).json(_.omit(user, "authentication")).end();
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

        const { username, email, password } = req.body;

        if (!(username || email) || !password) {
            res.status(400).json({ error: "Arguments missing!" })
        }

        const getUser = async () => {
            if (email) {
                return await getUserByEmail(email).select("+authentication.salt +authentication.password");;
            } else {
                return await getUserByUsername(username).select("+authentication.salt +authentication.password");;
            }
        }

        const user = await getUser();


        if (!user || !(user?.authentication?.password && await bcrypt.compare(password, user.authentication.password))) {
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

        res.status(200).json(token).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}