import { prisma } from "../config/prisma.config";
import { LogConstants } from "../constant/log.constant";
import { logger } from "../util/logger";

export const fetchChatHistoryByIdService = async (chatId: string, userId: string, limit: number) => {
    logger.info(`${LogConstants.FLOW.EXECUTING} [fetchChatHistoryByIdService]`, { chatId, userId, limit });
    return await prisma.message.findMany({
        where: { chatId, userId },
        orderBy: { createdAt: "asc" },
        take: isNaN(limit) ? undefined : limit
    });
}

export const createNewChatService = async (userId: string, title?: string) => {
    logger.info(`${LogConstants.FLOW.EXECUTING} [createNewChatService]`, { userId, title });
    return await prisma.chat.create({
        data: { 
            userId,
            title: title
        }
    });
}

export const updateChatByIdService = async (chatId: string, userId: string, updateData: { title?: string }) => {
    logger.info(`${LogConstants.FLOW.EXECUTING} [updateChatByIdService]`, { chatId, userId, updateData });
    return await prisma.chat.update({
        where: { id: chatId, userId },
        data: updateData
    });
}

export const deleteChatByIdService = async (chatId: string, userId: string) => {
    logger.info(`${LogConstants.FLOW.EXECUTING} [deleteChatByIdService]`, { chatId, userId });
    return await prisma.chat.deleteMany({
        where: { id: chatId, userId }
    });
}