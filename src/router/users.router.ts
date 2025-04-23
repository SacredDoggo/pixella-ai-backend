import express from "express";
import { getAllUsers } from "../controllers/users.controller";

export default (router: express.Router) => {
    router.get("/user/getAllUsers", getAllUsers);
}