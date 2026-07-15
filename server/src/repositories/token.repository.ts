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

    async findResetPasswordToken(token: string) {
        return prisma.token.findFirst({
            where: {
                token,
                type: TokenType.RESET_PASSWORD,
                expiresAt:   { gt: new Date() },   //  6:10 pm > 6:15 pm dapat less than sa new time huhu
                consumedAt:  null,                 // not already used
                revokedAt:   null,                 // not revoked
            }
        })
    }

    async findActiveRefreshToken(token: string) {
        return prisma.token.findFirst({
            where: {
                token,
                type: TokenType.REFRESH,
                expiresAt:   { gt: new Date() },   
                consumedAt:  null,                
                revokedAt:   null,                
            }
        })
    }

    async consumeToken(token: string) {
        return await prisma.token.update({
            where: { token },
            data: { consumedAt: new Date() }
        })
    }

    async revokeAllResetTokens(userId: string, exceptToken?: string) {
        return prisma.token.updateMany({
            where: {
                userId,
                type: TokenType.RESET_PASSWORD,
                consumedAt: null,
                revokedAt: null,
                token: { not: exceptToken } // skip the one we just consumed
            },
            data: { revokedAt: new Date() }
        })
    }
}