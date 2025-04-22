import express from "express";
import { register } from "../controllers/authentication.controller";

export default (router: express.Router) => {
    router.post("/auth/register", register);
    router.post("/auth/login", (req: express.Request, res: express.Response) => { res.send("Login") });
}