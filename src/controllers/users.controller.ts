import express from "express";

import { prisma } from "../config/prisma";

export const getAllUsers: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}

export const getUser: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        res.status(200).json({
            userId: req.user.userId,
            username: req.user.username,
            email: req.user.email
        }).end();
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}

export const getUserById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.params.user_id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

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

export const updateUserById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.params.user_id;

        // Check if there is an request body
        if (!req.body) {
            res.status(400).json({ error: "Bad Request: No body found" });
            return;
        }

        const updateData = req.body;
        updateData.id = userId; // Ensure the ID is set to the user being updated

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { password: true }
        });

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

export const deleteUserById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.params.user_id;

        const user = await prisma.user.delete({
            where: { id: userId }
        });

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