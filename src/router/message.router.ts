import express from "express";
import { isAuthenticated, validateId } from "../middlewares";
import { changeUserMessageAndRegenerate, continueChat, deleteMessageById, regenerateResponse, startNewChatAndRespond } from "../controllers/message.controller";

export default (router: express.Router) => {
    router.post("/message", isAuthenticated, startNewChatAndRespond);
    router.post("/message/:chat_id", validateId, isAuthenticated, continueChat);
    router.post("/message/regenerate/:message_id", validateId, isAuthenticated, regenerateResponse);
    router.patch("/message/change-prompt/:message_id", validateId, isAuthenticated, changeUserMessageAndRegenerate);
    router.delete("/message/delete-message/:message_id", validateId, isAuthenticated, deleteMessageById);
}