import express from "express";

// TODO: Change explicit any
export const register = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad Request: No body found" });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: "Arguments missing!" })
        }

        return res.status(200).end();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}