import { prisma } from "../config/prisma";

export const createNewMessageService = async (chatId: string, userId: string, role: "user" | "model", text: string, replyOf?: string) => {
    return await prisma.message.create({
        data: {
            chatId,
            userId,
            role,
            content: text,
            replyOf: replyOf || null,
        },
    });
}