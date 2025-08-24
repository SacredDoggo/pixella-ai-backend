import express from "express";

import { createNewChatService, fetchChatHistoryByIdService } from "../service/chat.service";
import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { createNewMessageService } from "../service/message.service";
import { generateContextForAI, generateResponseService } from "../service/ai.service";
import { ContextMessages } from "../types/generic.type";


export const startNewChatAndRespond = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.user.userId;

        if (!req.body) {
            res.status(400).json({ message: "Bad Request: No body found" });
            return;
        }

        const { userPrompt } = req.body;

        if (!userPrompt) {
            res.status(400).json({ message: "userPrompt is required" });
            return;
        }

        if (typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
            res.status(400).json({ message: "Text must be a non-empty string" });
            return;
        }

        const trimmedprompt = userPrompt.trim();

        const newChat = await createNewChatService(userId);

        const contextMsgs: ContextMessages[] = await generateContextForAI(newChat.id, userId);

        contextMsgs.push({ role: "user", parts: [{ text: trimmedprompt }] });

        const geminiResponse: GenerateContentResponse = await generateResponseService(contextMsgs);

        const userMsg = await createNewMessageService(newChat.id, userId, "user", trimmedprompt);

        const aiMsg = await createNewMessageService(newChat.id, userId, "model", (geminiResponse.text || "Error while generating response"), userMsg.id);
        res.status(201).json({ chat: newChat, messages: [userMsg, aiMsg] }).end();
        return;
    } catch (error) {
        console.error("Error in startNewChatAndRespond:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

// TODO: Implement these controllers
export const continueChat = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const chatId = req.params.chat_id;

        if (!chatId) {
            res.status(400).json({ message: "Chat ID is required" });
            return;
        }


        const userId = req.user.userId;

        if (!req.body) {
            res.status(400).json({ message: "Bad Request: No body found" });
            return;
        }

        const { userPrompt } = req.body;

        if (!userPrompt) {
            res.status(400).json({ message: "userPrompt is required" });
            return;
        }

        if (typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
            res.status(400).json({ message: "userPrompt must be a non-empty string" });
            return;
        }

        const trimmedprompt = userPrompt.trim();

        const contextMsgs: ContextMessages[] = await generateContextForAI(chatId, userId);
        contextMsgs.push({ role: "user", parts: [{ text: trimmedprompt }] });

        const geminiResponse: GenerateContentResponse = await generateResponseService(contextMsgs);

        const userMsg = await createNewMessageService(chatId, userId, "user", trimmedprompt);

        const aiMsg = await createNewMessageService(chatId, userId, "model", (geminiResponse.text || "Error while generating response"), userMsg.id);

        res.status(200).json({ messages: [userMsg, aiMsg] }).end();
        return;
    } catch (error) {
        console.error("Error in continueChat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const regenerateResponse = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        res.sendStatus(200);
        return;
    } catch (error) {
        console.error("Error in regenerateResponse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const changeUserMessageAndRegenerate = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        res.sendStatus(200);
        return;
    } catch (error) {
        console.error("Error in changeUserMessageAndRegenerate:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteMessageById = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        res.sendStatus(200);
        return;
    } catch (error) {
        console.error("Error in deleteMessageById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};