import { fetchChatHistoryByIdService } from "./chat.service";
import { ContextMessages } from "../types/generic.type";
import SecretConfig from "../config/secrets.config";
import AIClient from "../config/ai.config"; 

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
    const ai = AIClient.instance;
    
    const response = await ai.models.generateContent({
        model: SecretConfig.geminiModel,
        contents,
    });

    return response.text;
}

export const generateChatTitle = async (contents: ContextMessages[]) => {
    const ai = AIClient.instance;
    
    const prompt: ContextMessages[] = [
        ...contents,
        { role: "user", parts: [{text: "Generate a concise, max 7 word chat title summarizing the user's and model's message. No quotes or special formatting. Output only the title."}] }
    ];

    const response = await ai.models.generateContent({
        model: SecretConfig.geminiModel,
        contents: prompt
    });

    return response.text;
};
