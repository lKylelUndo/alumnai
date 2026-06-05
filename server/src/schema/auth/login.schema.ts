import { z } from "zod"

export const loginSchema = z.object({
    body: z.object({
        email: z.string({message: "Email is required"}).email("Invalid email format"),
        password: z.string().min(1, "Password is required")
    })
})

export type loginInputTypes = z.infer<typeof loginSchema>['body']