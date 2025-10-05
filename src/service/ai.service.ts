import SecretConfig from "../config/secrets.config";
import AIClient from "../config/ai.config"; 

import { fetchChatHistoryByIdService } from "./chat.service";
import { logger } from "../util/logger";
import { LogConstants } from "../constant/log.constant";

import { ContextMessages } from "../types/generic.type";

export const generateContextForAI = async (chatId: string, userId: string): Promise<ContextMessages[]> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [generateContextForAI]`, { chatId, userId });

    // Fetch last 10 messages from the chat for context
    const messages = await fetchChatHistoryByIdService(chatId, userId, 10);

    logger.info(`${LogConstants.FLOW.EXITING} [generateContextForAI]`, { chatId, userId });
    
    // Format messages for AI input
    return messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content[msg.content.length - 1] }]
    }));
}

export const generateResponseService = async (contents: ContextMessages[]) => {
    logger.info(`${LogConstants.FLOW.ENTERING} [generateResponseService]`);

    const ai = AIClient.instance;
    
    logger.info(`${LogConstants.FLOW.EXECUTING} [AIClient.models.generateContent]`, { model: SecretConfig.geminiModel });
    const response = await ai.models.generateContent({
        model: SecretConfig.geminiModel,
        contents,
    });

    logger.info(`${LogConstants.FLOW.EXITING} [generateResponseService]`);

    return response.text;
}

export const generateChatTitle = async (contents: ContextMessages[]) => {
    logger.info(`${LogConstants.FLOW.ENTERING} [generateChatTitle]`);

    const ai = AIClient.instance;
    
    const prompt: ContextMessages[] = [
        ...contents,
        { role: "user", parts: [{text: "Generate a concise, max 7 word chat title summarizing the user's and model's message. No quotes or special formatting. Output only the title."}] }
    ];

    logger.info(`${LogConstants.FLOW.EXECUTING} [AIClient.models.generateContent]`, { model: SecretConfig.geminiModel });
    const response = await ai.models.generateContent({
        model: SecretConfig.geminiModel,
        contents: prompt
    });

    logger.info(`${LogConstants.FLOW.EXITING} [generateChatTitle]`);

    return response.text;
};
