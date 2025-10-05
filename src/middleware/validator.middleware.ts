import express from "express";
import { ObjectId } from "mongodb";
import { logger } from "../util/logger";
import { LogConstants } from "../constant/log.constant";

const isValidObjectId = (id: string): boolean => {
    logger.info(`${LogConstants.FLOW.EXECUTING} [isValidObjectId]`, { id });
    return ObjectId.isValid(id) && (String)(new ObjectId(id)) === id;
}

export const validateId: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [validateId] Middleware invoked`);

    try {
        const id = req.params.user_id || req.params.chat_id || req.params.message_id;

        // Check if the ID is a valid ObjectId
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }

        logger.info(`${LogConstants.FLOW.EXITING} [validateId] Middleware completed successfully`, { id });

        next();
    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [validateId] Middleware error`, { error });
        res.sendStatus(500);
        return;
    }
}