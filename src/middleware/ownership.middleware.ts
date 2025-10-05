import express from "express";
import { prisma } from "../config/prisma.config";
import { logger } from "../util/logger";
import { LogConstants } from "../constant/log.constant";

export const isAccountOwner: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [isAccountOwner] Middleware invoked`);

    try {
        const id = req.params.user_id;

        if (!req.user) {
            res.sendStatus(401);
            return;
        }

        const { userId } = req.user;

        if (!userId || userId != id) {
            res.sendStatus(401);
            return;
        }

        logger.info(`${LogConstants.FLOW.EXITING} [isAccountOwner] Middleware completed successfully`, { userId: req.user.userId, username: req.user.username, email: req.user.email });
        next();
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [isAccountOwner] Middleware error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const isChatOwner: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [isChatOwner] Middleware invoked`);

    try {
        const chatId = req.params.chat_id;

        if (!chatId) {
            res.status(400).json({ error: "Chat ID is required" });
            return;
        }

        // Authentication middleware should have already set req.user
        const { userId } = req.user;

        // Check if the chat belongs to the user
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { userId: true },
        });

        if (!chat || chat.userId !== userId) {
            res.status(401).json({ error: "Unauthorized: Chat does not belong to user" }).end();
            return;
        }

        logger.info(`${LogConstants.FLOW.EXITING} [isChatOwner] Middleware completed successfully`, { userId: req.user.userId, username: req.user.username, email: req.user.email });

        next();
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [isChatOwner] Middleware error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const isMessageOwner: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [isMessageOwner] Middleware invoked`);

    try {
        const messageId = req.params.message_id;

        if (!messageId) {
            res.status(400).json({ error: "Message ID is required" });
            return;
        }

        // Authentication middleware should have already set req.user
        const { userId } = req.user;

        // Check if the message belongs to the user via the chat
        const message = await prisma.message.findUnique({
            where: { id: messageId },
            select: { userId: true },
        });

        if (!message || message.userId !== userId) {
            res.status(401).json({ error: "Unauthorized: Message does not belong to user" }).end();
            return;
        }

        logger.info(`${LogConstants.FLOW.EXITING} [isMessageOwner] Middleware completed successfully`, { userId: req.user.userId, username: req.user.username, email: req.user.email });

        next();
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [isMessageOwner] Middleware error`, { error });
        res.sendStatus(500);
        return;
    }
}