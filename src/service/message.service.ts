import { prisma } from "../config/prisma.config";
import { LogConstants } from "../constant/log.constant";
import { logger } from "../util/logger";

export const createNewMessageService = async (chatId: string, userId: string, role: "user" | "model", text: string, replyOf?: string) => {
    logger.info(`${LogConstants.FLOW.ENTERING} [createNewMessageService]`, { chatId, userId, role, replyOf });

    logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.message.create]`, { chatId, userId, role, replyOf });
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
    logger.info(`${LogConstants.FLOW.EXECUTING} [prisma.chat.update]`, { chatId, lastMessageAt: message.createdAt });
    await prisma.chat.update({
        where: { id: chatId },
        data: { lastMessageAt: message.createdAt }
    });

    logger.info(`${LogConstants.FLOW.EXITING} [createNewMessageService]`, { messageId: message.id });

    return message;
}