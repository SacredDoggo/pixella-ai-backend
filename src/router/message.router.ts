import express from "express";
import {isAuthenticated, isChatOwner, isMessageOwner, validateId} from "../middleware";
import { changeUserMessageAndRegenerate, continueChat, deleteMessageById, regenerateResponse, startNewChatAndRespond } from "../controller/message.controller";

export default (router: express.Router) => {
    router.post("/message", isAuthenticated, startNewChatAndRespond);
    router.post("/message/:chat_id", validateId, isAuthenticated, isChatOwner, continueChat);
    router.post("/message/regenerate/:message_id", validateId, isAuthenticated, isMessageOwner, regenerateResponse);
    router.patch("/message/change-prompt/:message_id", validateId, isAuthenticated, isMessageOwner, changeUserMessageAndRegenerate);
    router.delete("/message/delete-message/:message_id", validateId, isAuthenticated, isMessageOwner, deleteMessageById);
}