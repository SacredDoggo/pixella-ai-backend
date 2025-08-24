import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import router from "./router";
import { swaggerSpec } from "./config/swagger";

const app = express();

const port = process.env.PORT || 3000;

// Cors handling
app.use(cors());

// Parse incoming requests body for application/json
app.use(express.json());

// Router (this routes the requests)
app.use("/api/v1/", router());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/working', (_req, res) => res.json({ ok: true }));

// Local server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;