import { z } from "zod";

export const signUpSchema = z.object({
    body: z.object({
        studentIdNumber: z.string({message: "Student id number is required"}).length(8, "Student id number must be exactly 8 digits").regex(/^\d+$/, "Student ID must contain only numbers"),
        email: z.string({message: "Email is required"}).email("Invalid email format"),
        password: z.string({message: "Password is required"}).min(8, "Password must be atleast 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
    })
})

export type SignupInputTypes = z.infer<typeof signUpSchema>["body"];