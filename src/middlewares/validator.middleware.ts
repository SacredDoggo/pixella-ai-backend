import express from "express";
import { ObjectId } from "mongodb";

const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id) && (String)(new ObjectId(id)) === id;
}

export const validateId: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const id = req.params.user_id || req.params.chat_id || req.params.message_id;

        // Check if the ID is a valid ObjectId
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }

        next();
    } catch (error) {
        res.sendStatus(500);
        return;
    }
}