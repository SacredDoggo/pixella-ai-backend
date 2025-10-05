import express from "express";
import { prisma } from "../config/prisma.config";

import { createNewChatService, deleteChatByIdService, fetchChatHistoryByIdService, updateChatByIdService } from "../service/chat.service";
import { LogConstants } from "../constant/log.constant";
import { logger } from "../util/logger";

export const getUserChats: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [getUserChats] Controller invoked`);

    try {
        const userId = req.user.userId;

        logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.chat.findMany] Fetching chats for user`, { userId });
        const chats = await prisma.chat.findMany({
            where: { userId },
            orderBy: { lastMessageAt: "desc" },
            include: {
                _count: {
                    select: { messages: true }
                }
            }
        });

        logger.info(`${LogConstants.FLOW.COMPLETED} [getUserChats] Controller completed successfully`, { userId, chatCount: chats.length });

        res.status(200).json(chats).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [getUserChats] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const getChatHistoryById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [getChatHistoryById] Controller invoked`);

    try {
        const chatId = req.params.chat_id;
        const limit = parseInt(req.params.limit);
        const userId = req.user.userId;

        logger.info(`${LogConstants.FLOW.EXECUTING} [fetchChatHistoryByIdService] Fetching chat history`, { chatId, userId, limit });
        const chats = await fetchChatHistoryByIdService(chatId, userId, limit);

        logger.info(`${LogConstants.FLOW.COMPLETED} [getChatHistoryById] Controller completed successfully`, { chatId, userId, messageCount: chats.length });

        res.status(200).json(chats).end();
        return;
    } catch (error) {
        console.error("[getChatHistoryById] Controller error: ", error);
        res.sendStatus(500);
        return;
    }
}

export const startNewChat: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [startNewChat] Controller invoked`);

    try {
        const userId = req.user.userId;

        logger.info(`${LogConstants.FLOW.EXECUTING} [createNewChatService] Creating new chat for user`, { userId });
        const newChat = await createNewChatService(userId);

        logger.info(`${LogConstants.FLOW.COMPLETED} [startNewChat] Controller completed successfully`, { userId, chatId: newChat.id });

        res.status(201).json(newChat).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [startNewChat] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const updateChatById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [updateChatById] Controller invoked`);

    try {
        const chatId = req.params.chat_id;
        const userId = req.user.userId;

        // Check if there is an request body
        if (!req.body) {
            res.status(400).json({ error: "Bad Request: No body found" });
            return;
        }

        const { title } = req.body;

        if (!title) {
            res.status(400).json({ error: "Arguments missing!" })
            return;
        }

        logger.info(`${LogConstants.FLOW.EXECUTING} [updateChatByIdService] Updating chat`, { chatId, userId, title });
        const updatedChat = await updateChatByIdService(chatId, userId, { title });

        logger.info(`${LogConstants.FLOW.COMPLETED} [updateChatById] Controller completed successfully`, { chatId, userId });

        res.status(200).json(updatedChat).end();
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [updateChatById] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}

export const deleteChatById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [deleteChatById] Controller invoked`);

    try {
        const chatId = req.params.chat_id;
        const userId = req.user.userId;

        logger.info(`${LogConstants.FLOW.EXECUTING} [deleteChatByIdService] Deleting chat`, { chatId, userId });
        const chat = await deleteChatByIdService(chatId, userId);

        if (!chat) {
            res.status(404).json({ error: "Chat does not exists." });
            return;
        }

        logger.info(`${LogConstants.FLOW.COMPLETED} [deleteChatById] Controller completed successfully`, { chatId, userId });

        res.sendStatus(204);
        return;
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [deleteChatById] Controller error`, { error });
        res.sendStatus(500);
        return;
    }
}