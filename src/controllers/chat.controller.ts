import express from "express";
import { prisma } from "../config/prisma";

import { createNewChatService, deleteChatByIdService, fetchChatHistoryByIdService, updateChatByIdService } from "../service/chat.service";

export const getUserChats: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.user.userId;

        const chats = await prisma.chat.findMany({
            where: { userId },
            orderBy: { lastMessageAt: "desc" },
            include: {
                _count: {
                    select: { messages: true }
                }
            }
        });

        res.status(200).json(chats).end();
        return;
    } catch (error) {
        console.error("[chat.controller] getUserChats error: ", error);
        res.sendStatus(500);
        return;
    }
}

export const getChatHistoryById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const chatId = req.params.chat_id;
        const limit = parseInt(req.params.limit);
        const userId = req.user.userId;

        const chats = await fetchChatHistoryByIdService(chatId, userId, limit);

        res.status(200).json(chats).end();
        return;
    } catch (error) {
        console.error("[chat.controller] getChatHistoryById error: ", error);
        res.sendStatus(500);
        return;
    }
}

export const startNewChat: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.user.userId;

        const newChat = await createNewChatService(userId);

        res.status(201).json(newChat).end();
        return;
    } catch (error) {
        console.error("[chat.controller] startNewChat error: ", error);
        res.sendStatus(500);
        return;
    }
}

export const updateChatById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
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

        const updatedChat = await updateChatByIdService(chatId, userId, { title });

        res.status(200).json(updatedChat).end();
        return;
    } catch (error) {
        console.error("[chat.controller] updateChatById error: ", error);
        res.sendStatus(500);
        return;
    }
}

export const deleteChatById: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const chatId = req.params.chat_id;
        const userId = req.user.userId;

        const chat = await deleteChatByIdService(chatId, userId);

        if (!chat) {
            res.status(404).json({ error: "Chat does not exists." });
            return;
        }

        await prisma.chat.delete({
            where: { id: chatId }
        });

        res.sendStatus(204);
        return;
    } catch (error) {
        console.error("[chat.controller] deleteChatById error: ", error);
        res.sendStatus(500);
        return;
    }
}