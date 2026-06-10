import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User id is required"),
    profilePicture: z.string().optional(),
    yearLevel: z.string().optional(),
    fullName: z.string().optional(),
    work_field: z.string().optional(),
    socialLinks: z.record(z.string(), z.any()).optional(),
    companyName: z.string().optional(),
    current_position: z.string().optional(),
    certifications: z.array(z.string()).optional()
  }),
});

export type UpdateProfileInputTypes = z.infer<typeof updateProfileSchema>["body"];