import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import SecretConfig from "../config/secrets.config";

dotenv.config();

export const isAuthenticated: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
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
            next();
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error ${process.env.NODE_ENV !== 'production' && "[authentication.middleware]"}` });
        return;
    }
}
