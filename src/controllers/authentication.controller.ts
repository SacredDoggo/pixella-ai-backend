import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createUser, getUserByEmail, getUserByUsername } from "../db/users";

// TODO: Change explicit any
export const register = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad Request: No body found" });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: "Arguments missing!" })
        }

        const existingUserEmail = await getUserByEmail(email);
        if (existingUserEmail) {
            return res.status(409).json({ error: "Email already exists." });
        }

        const existingUsername = await getUserByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ error: "Username already taken." });
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

        return res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export const login = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad Request: No body found" });
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

            return res.status(404).json({ error: "Invaid credentials!" });
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

        return res.status(200).json(token).end();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}