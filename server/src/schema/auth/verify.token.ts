import { z } from "zod";

export const verifyResetPasswordTokenSchema = z.object({
    body: z.object({
        token: z.string().min(1,"Reset password token is required")
    })
})

export type VerifyResetPasswordTokenTypes = z.infer<typeof verifyResetPasswordTokenSchema>["body"]