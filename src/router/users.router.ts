import express from "express";
import { deleteUserById, getAllUsers, getUser, getUserById, updateUserById } from "../controllers/users.controller";
import { isAccountOwner, isAuthenticated, validateId } from "../middlewares";

export default (router: express.Router) => {
    if (process.env.NODE_ENV !== 'production') router.get("/user/getAllUsers", getAllUsers);
    router.get("/user", isAuthenticated, getUser);
    router.get("/user/:user_id", validateId, isAuthenticated, isAccountOwner, getUserById);
    router.patch("/user/:user_id", validateId, isAuthenticated, isAccountOwner, updateUserById);
    router.delete("/user/:user_id", validateId, isAuthenticated, isAccountOwner, deleteUserById);
}