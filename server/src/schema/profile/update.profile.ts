import { z } from "zod";

export const updateProfileSchema = z
  .object({
    body: z.object({
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
      certifications: z.array(
          z.object({
            profileId: z.string().min(1, "Profile id is required"),
            name: z.string().min(1, "Name is required"),
            issuer: z.string().min(1, "Issuer is required"),
            fileUrl: z.string().optional(),
          }),
        )
        .optional(),
    }),
  })
  .refine((data) => Object.keys(data.body).length > 1, {
    message: "At least one field is required to update",
  });

export type UpdateProfileInputTypes = z.infer<
  typeof updateProfileSchema
>["body"];
