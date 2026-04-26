import type { Request, Response, NextFunction } from "express"
import "dotenv/config";
import jwt from "jsonwebtoken"
const JWT_PASSWORD = process.env.JWT_SECRET;
export const userMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header=req.headers["authorization"]
    if (!JWT_PASSWORD) {
        return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }
    if (!header) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    try {
        const token = header.replace("Bearer ", "");
        const decode = jwt.verify(token, JWT_PASSWORD) as { id: string };
        //@ts-ignore
        req.userId = decode.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}