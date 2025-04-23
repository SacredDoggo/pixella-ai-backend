import express from "express";
import { getUsers } from "../db/users.db";

export const getAllUsers: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.status(200).json(users).end();
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}