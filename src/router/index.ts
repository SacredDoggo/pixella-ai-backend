import express from "express";
import authenticationRouter from "./authentication.router";
import usersRouter from "./users.router";
import chatRouter from "./chat.router";
import messageRouter from "./message.router";

const router = express.Router();

export default (): express.Router => {
    authenticationRouter(router);
    usersRouter(router);
    chatRouter(router);
    messageRouter(router);
    
    return router;
}