import jwt from "jsonwebtoken";

export enum TokenExpiry {
    ACCESS_TOKEN_EXPIRES = "15m",
    REFRESH_TOKEN_EXPIRES = "7d"
}

export function signAccessToken() {

}

export function signRefreshToken() {
    
}