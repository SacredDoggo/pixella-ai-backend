import { prisma } from "../config/prisma";

export const createNewMessageService = async (chatId: string, userId: string, role: "user" | "model", text: string) => {
    return await prisma.message.create({
        data: {
            chatId,
            userId,
            role,
            content: text,
        },
    });
}