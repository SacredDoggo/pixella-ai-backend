import { Application, Request } from 'express';
import cors, { CorsOptions } from 'cors';

export const configureCors = (app: Application): void => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://pixella-ai.vercel.app',
    'https://www.pixella-ai.vercel.app'
  ];

  const corsOptions: CorsOptions = {
    origin(origin: string | undefined, callback) {
      // Allow requests like Postman with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
}
