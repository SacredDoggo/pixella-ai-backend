import { prisma } from "../config/prisma.config";

export const fetchChatHistoryByIdService = async (chatId: string, userId: string, limit: number) => {
    return await prisma.message.findMany({
        where: { chatId, userId },
        orderBy: { createdAt: "asc" },
        take: isNaN(limit) ? undefined : limit
    });
}

export const createNewChatService = async (userId: string, title?: string) => {
    return await prisma.chat.create({
        data: { 
            userId,
            title: title
        }
    });
}

export const updateChatByIdService = async (chatId: string, userId: string, updateData: { title?: string }) => {
    return await prisma.chat.update({
        where: { id: chatId, userId },
        data: updateData
    });
}

export const deleteChatByIdService = async (chatId: string, userId: string) => {
    return await prisma.chat.deleteMany({
        where: { id: chatId, userId }
    });
}