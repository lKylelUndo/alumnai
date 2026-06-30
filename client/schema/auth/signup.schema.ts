import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  studentIdNumber: z.string().length(8, "Student id number only contains 8 numbers").regex(/^\d+$/, "Student ID must contain only numbers"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number"),
})

export type SignupInputTypes = z.infer<typeof signupSchema>