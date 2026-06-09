import { z } from "zod"

export const forgetPasswordRequestSchema = z.object({
    body: z.object({
        email: z.string({message: "Email is required"}).email("Invalid email format")
    })
})

export type ForgetPasswordRequestInputTypes = z.infer<typeof forgetPasswordRequestSchema>['body']