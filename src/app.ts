import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';
import morgan from "morgan";

import router from "./router";
import { configureCors } from "./config/cors.config";
import SecretConfig from "./config/secrets.config";
import { logger } from "./util/logger";
import { errorHandler } from "./middleware";

const app = express();

const port = process.env.PORT || 3000;

// Cors handling
configureCors(app)

// Parse incoming requests body for application/json
app.use(express.json());

// Parse incoming requests body for application/x-www-form-urlencoded
app.use(errorHandler);

// Router (this routes the requests)
app.use("/api/v1/", router());
app.get('/working', (_req, res) => res.json({ ok: true }));

// Check secret configuration
SecretConfig.validateConfig();

// HTTP request logging using morgan, integrated with winston
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message: string) => logger.http('HTTP Request', { message: message.trim() })
  }
}));

// Local server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;