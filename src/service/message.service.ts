import { prisma } from "../config/prisma.config";

export const createNewMessageService = async (chatId: string, userId: string, role: "user" | "model", text: string, replyOf?: string) => {

    const message = await prisma.message.create({
        data: {
            chatId,
            userId,
            role,
            content: [text],
            replyOf: replyOf || null,
        },
    });

    // Update the chat's lastMessageAt
    await prisma.chat.update({
        where: { id: chatId },
        data: { lastMessageAt: message.createdAt }
    });

    return message;
}