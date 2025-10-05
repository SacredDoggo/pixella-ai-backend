import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';

import router from "./router";
import { configureCors } from "./config/cors.config";
import SecretConfig from "./config/secrets.config";

const app = express();

const port = process.env.PORT || 3000;

// Cors handling
configureCors(app)

// Parse incoming requests body for application/json
app.use(express.json());

// Router (this routes the requests)
app.use("/api/v1/", router());
app.get('/working', (_req, res) => res.json({ ok: true }));

// Check secret configuration
SecretConfig.validateConfig();

// Local server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;