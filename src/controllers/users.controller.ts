import express from "express";
import mongoose from "mongoose";
import _ from "lodash";

import {
    getUsers,
    getUserById,
    updateUserById,
    getUserByEmail,
    getUserByUsername,
    deleteUserById
} from "../db/users.db";

export const get_all_users: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.status(200).json(users).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}

export const get_user_by_id: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await getUserById(userId);

        if (!user) {
            res.status(404).json({ error: "User does not exists." });
            return;
        }

        res.status(200).json(user).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}

export const update_user_by_id: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.params.id;

        // Check if there is an request body
        if (!req.body) {
            res.status(400).json({ error: "Bad Request: No body found" });
            return;
        }

        const updateData = _.omit(req.body, "_id");


        if (updateData.email) {
            const existingUserEmail = await getUserByEmail(updateData.email);
            if (existingUserEmail) {
                res.status(409).json({ error: "Email is used by other account." });
                return;
            }
        }

        if (updateData.username) {
            const existingUsername = await getUserByUsername(updateData.username);
            if (existingUsername) {
                res.status(409).json({ error: "Username already taken." });
                return;
            }
        }

        const user = await updateUserById(userId, updateData);

        if (!user) {
            res.status(404).json({ error: "User does not exists." });
            return;
        }

        res.status(200).json(user).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}

export const delete_user_by_id: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await deleteUserById(userId);

        if (!user) {
            res.status(404).json({ error: "User does not exists." });
            return;
        }

        res.status(200).json(user).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}