import { signAccessToken, signRefreshToken, TokenExpiry, verifyRefreshToken } from "@/lib/jwt";
import { TokenRepository } from "@/repositories/token.repository";
import { UserRepository } from "@/repositories/user.repository";

export async function RefreshTokenService(refreshToken: string) {
   try {
    const payload = verifyRefreshToken(refreshToken!);

     // 1. Verify JWT signature and type
    if (!payload) {
        return { code: 401, status: "error", message: "Invalid or expired refresh token" };
    }
    
    const tokenRepository = new TokenRepository();
    const userRepository = new UserRepository();

    // 2. Check Database for the token (to verify it's not consumed/revoked)
    const dbToken = await tokenRepository.findActiveRefreshToken(refreshToken!);
    if (!dbToken) {
        return { code: 401, status: "error", message: "Token is no longer valid or has been used" };
    }

    // 3. Verify if user still exist
    const user = await userRepository.findById(payload.userId);
    if (!user) {
        return { code: 401, status: "error", message: "User does not exist" };
    }

    if (!user.isAccountVerified) {
        return { code: 403, status: "error", message: "Account is not verified" };
    }

    // 4. Token Rotation: Consume the old token and generate a new pair
    await tokenRepository.consumeToken(dbToken.token);

    // generate new token pair
     const accessToken = signAccessToken(user.id, user.email, user.role);
     const newRefreshToken = signRefreshToken(user.id, user.email, user.role);

     // 5. Store the new refresh token
    await tokenRepository.storeRefreshToken(user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    const { password, ...rest } = user;

    return { 
        code: 200, 
        status: "success", 
        message: "Session refreshed - tokens refreshed successfully",
        data: { 
           tokens: {
             accessToken, 
            refreshToken: newRefreshToken,
            accessTokenexpiresIn: TokenExpiry.ACCESS_TOKEN_EXPIRES,
            refreshExpiresIn: TokenExpiry.REFRESH_TOKEN_EXPIRES,
           },
           user: rest
        } 
    };
    
   } catch (error) {
    console.error("RefreshTokenService error: ", error);
    return { code: 500, status: "error", message: error }
   }
}