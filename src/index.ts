import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import router from "./router";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

// Cors handling
app.use(cors());

// Parse incoming requests body for application/json
app.use(express.json());

// Mongoose setup
mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASE_URL!);
mongoose.connection.on('error', (error: Error) => { console.log(error) });

// Router (this routes the requests)
app.use("/", router());

// Export for Vercel
export default app;

// Local server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}