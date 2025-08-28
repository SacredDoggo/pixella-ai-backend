import express from "express";
import { isAuthenticated, isChatOwner, validateId } from "../middlewares";
import { getUserChats, deleteChatById, getChatHistoryById, startNewChat, updateChatById } from "../controllers/chat.controller";

export default (router: express.Router) => {
    router.get("/chat", isAuthenticated, getUserChats);
    router.post("/chat", isAuthenticated, startNewChat);
    router.get("/chat/:chat_id", validateId, isAuthenticated, isChatOwner, getChatHistoryById);
    router.patch("/chat/:chat_id", validateId, isAuthenticated, isChatOwner, updateChatById);
    router.delete("/chat/:chat_id", validateId, isAuthenticated, isChatOwner, deleteChatById);
}