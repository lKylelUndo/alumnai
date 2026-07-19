import { z } from "zod"

export const updateProfileSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  profilePicture: z.string().optional(),
  aboutMe: z.string().optional(),
  graduatedYear: z.string().optional(),
  yearLevel: z.string().optional(),
  fullName: z.string().optional(),
  work_field: z.string().optional(),
  socialLink: z.string().optional(),
  companyName: z.string().optional(),
  current_position: z.string().optional(),
  certifications: z
    .array(
      z.object({
        id: z.string().optional(),
        profileId: z.string().optional(),
        name: z.string().min(1, "Name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        fileUrl: z.string().optional(),
        fileBase64: z.string().optional(),
        fileName: z.string().optional(),
      })
    )
    .optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
