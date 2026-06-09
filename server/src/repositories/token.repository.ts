import { TokenType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export class TokenRepository {
    async storeRefreshToken(userId: string, token: string, expiresAt: string | Date) {
        return prisma.token.create({
            data: {
                userId,
                token,
                expiresAt,
                type: TokenType.REFRESH
            }
        })
    }

    async storeResetPasswordToken(userId: string, token: string, expiresAt: string | Date) {
         return prisma.token.create({
            data: {
                userId,
                token,
                expiresAt,
                type: TokenType.RESET_PASSWORD
            }
        })
    }
}