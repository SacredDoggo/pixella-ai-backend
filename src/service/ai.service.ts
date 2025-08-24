import { GoogleGenAI } from "@google/genai";
import { fetchChatHistoryByIdService } from "./chat.service";
import { ContextMessages } from "../types/generic.type";

export const generateContextForAI = async (chatId: string, userId: string): Promise<ContextMessages[]> => {
    // Fetch last 10 messages from the chat for context
    const messages = await fetchChatHistoryByIdService(chatId, userId, 10);

    // Format messages for AI input
    return messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content[msg.content.length - 1] }]
    }));
}

export const generateResponseService = async (contents: ContextMessages[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents,
    });
}