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
    return jwt.sign({userId, email, role, type: "refresh"}, ENV.JWT_SECRET, {expiresIn: TokenExpiry.REFRESH_TOKEN_EXPIRES})
}

export function verifyAccessToken(token: string) {
    try {
        //const payload = jwt.verify(token, ENV.JWT_SECRET)
        //return payload. === "access"
    } catch (error) {
        return null;
    }
}

export function verifyRefreshToken(token: string) {
    
}

export function ms ( value: number, unit: "seconds" | "minutes" | "hours" | "days" ) {
  const multipliers = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
};