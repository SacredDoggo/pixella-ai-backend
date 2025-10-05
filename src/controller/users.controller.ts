import express from "express";

import { prisma } from "../config/prisma.config";
import { logger } from "../util/logger";
import { LogConstants } from "../constant/log.constant";
import { log } from "console";

export const getAllUsers: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [getAllUsers] Controller invoked`);

    try {
        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.user.findMany] Fetching all users`);
        const users = await prisma.user.findMany();

        logger.info(`${LogConstants.FLOW.COMPLETED} [getAllUsers] Controller completed successfully`, { userCount: users.length });

        res.status(200).json(users).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [getAllUsers] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const getUser: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [getUser] Controller invoked`);

    try {
        logger.info(`${LogConstants.FLOW.COMPLETED} [getUser] Controller completed successfully`, { userId: req.user.userId });
        res.status(200).json({
            userId: req.user.userId,
            username: req.user.username,
            email: req.user.email
        }).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [getUser] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const getUserById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [getUserById] Controller invoked`);

    try {
        const userId = req.params.user_id;

        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.user.findUnique] Fetching user by ID`, { userId });
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: "User does not exists." });
            return;
        }

        logger.info(`${LogConstants.FLOW.COMPLETED} [getUserById] Controller completed successfully`, { userId: user.id });

        res.status(200).json(user).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [getUserById] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const updateUserById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [updateUserById] Controller invoked`);

    try {
        const userId = req.params.user_id;

        // Check if there is an request body
        if (!req.body) {
            res.status(400).json({ error: "Bad Request: No body found" });
            return;
        }

        const updateData = req.body;
        updateData.id = userId; // Ensure the ID is set to the user being updated

        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.user.update] Updating user`, { userId, updateData });
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { password: true }
        });

        if (!user) {
            res.status(404).json({ error: "User does not exists." });
            return;
        }

        const { password, ...userWithoutPassword } = user;

        logger.info(`${LogConstants.FLOW.COMPLETED} [updateUserById] Controller completed successfully`, { userId: user.id });

        res.status(200).json(userWithoutPassword).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [updateUserById] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const deleteUserById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [deleteUserById] Controller invoked`);

    try {
        const userId = req.params.user_id;

        const user = await prisma.user.delete({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({ error: "User does not exists." });
            return;
        }

        logger.info(`${LogConstants.FLOW.COMPLETED} [deleteUserById] Controller completed successfully`, { userId: user.id });

        res.status(200).json(user).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [deleteUserById] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}