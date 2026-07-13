import { z } from "zod"

export const updateProfileSchema = z
  .object({
    userId: z.string().min(1, "User id is required"),
    profilePicture: z.string().optional(),
    aboutMe: z.string().optional(),
    graduatedYear: z.string().optional(),
    coreSkills: z.array(z.string()).optional(),
    yearLevel: z.string().optional(),
    fullName: z.string().optional(),
    work_field: z.string().optional(),
    socialLink: z.string().optional(),
    companyName: z.string().optional(),
    current_position: z.string().optional(),
    certifications: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field is required to update",
  })

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
