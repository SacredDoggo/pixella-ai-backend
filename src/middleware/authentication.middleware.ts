import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

import SecretConfig from "../config/secrets.config";
import { logger } from "../util/logger";
import { LogConstants } from "../constant/log.constant";

dotenv.config();

export const isAuthenticated: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    logger.info(`${LogConstants.FLOW.ENTERING} [isAuthenticated] Middleware invoked`);
    try {
        const authHeader = req.headers['authorization']; // Will be removed in future versions
        const token: string | undefined = (req.cookies && req.cookies.token) || (authHeader && authHeader.split(' ')[1]); // Get the token from cookie or header

        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        jwt.verify(token, SecretConfig.jwtSecret, (err, payLoad) => {
            if (err || !(payLoad && typeof payLoad === "object")) {
                res.status(401).json({ message: 'Invalid or expired token' });
                return;
            }

            if (!payLoad.userId || !payLoad.username || !payLoad.email) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }

            req.user = payLoad as JwtPayload; // user contains payload (userId, username, email, etc.)

            logger.info(`${LogConstants.FLOW.EXITING} [isAuthenticated] Middleware completed successfully`, { userId: req.user.userId, username: req.user.username, email: req.user.email });
            next();
        });

    } catch (error) {
        logger.error(`${LogConstants.ERROR_TYPES.INTERNAL} [isAuthenticated] Middleware error`, { error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}
