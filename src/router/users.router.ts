import express from "express";
import { delete_user_by_id, get_all_users, get_user_by_id, update_user_by_id } from "../controllers/users.controller";
import { isAccountOwner, isAuthenticated, validateId } from "../middlewares";

export default (router: express.Router) => {
    router.get("/user/getAllUsers", get_all_users);
    router.get("/user/:id", validateId, isAuthenticated, isAccountOwner, get_user_by_id);
    router.patch("/user/:id", validateId, isAuthenticated, isAccountOwner, update_user_by_id);
    router.delete("/user/:id", validateId, isAuthenticated, isAccountOwner, delete_user_by_id);
}