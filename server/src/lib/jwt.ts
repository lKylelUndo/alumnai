import { ENV } from "@/config/env";
import jwt from "jsonwebtoken";

export enum TokenExpiry {
  ACCESS_TOKEN_EXPIRES = "15m",
  REFRESH_TOKEN_EXPIRES = "7d",
}

export function signAccessToken(userId: string, email: string | null, role: string) {
    return jwt.sign({userId, email, role, type: "access"}, ENV.JWT_SECRET, {expiresIn: TokenExpiry.ACCESS_TOKEN_EXPIRES})
}

export function signRefreshToken(userId: string, email: string | null, role: string) {
    return jwt.sign({userId, email, role, type: "access"}, ENV.JWT_SECRET, {expiresIn: TokenExpiry.REFRESH_TOKEN_EXPIRES})
}

export function verifyAccessToken(token: string) {
    try {
        const payload = jwt.verify(token, ENV.JWT_SECRET)
        //return payload. === "access"
    } catch (error) {
        return null;
    }
}

export function verifyRefreshToken(token: string) {
    
}
