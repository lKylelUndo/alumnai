import { z } from "zod"

export const resetPasswordSchema = z.object({
    body: z.object({
        userId: z.string().min(1, "User id is required"),
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string({message: "Password is required"}).min(8, "Password must be atleast 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
    })
})

export type ResetPasswordInputTypes = z.infer<typeof resetPasswordSchema>['body']