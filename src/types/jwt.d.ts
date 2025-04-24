import { ObjectId } from "mongoose";

declare global {
    namespace Express {
      interface Request {
        user?: JwtPayload;
      }
    }
  }
  
  export interface JwtPayload {
    userId: String;
    username: String;
    email: String;
    iat: number;
    exp: number;
  }