import { z } from "zod";

export const updateProfileSchema = z
  .object({
    body: z.object({
      // Optional legacy field — the server always uses the token's userId.
      userId: z.string().min(1, "User id is required").optional(),
      profilePicture: z.string().optional(),
      aboutMe: z.string().optional(),
      graduatedYear: z.string().optional(),
      yearLevel: z.string().optional(),
      fullName: z.string().trim().min(1, "Full name is required").optional(),
      work_field: z.string().optional(),
      socialLink: z.string().optional(),
      companyName: z.string().optional(),
      current_position: z.string().optional(),
      isAvailableForMentorship: z.boolean().optional(),
      isAvailableForCollaboration: z.boolean().optional(),
      certifications: z.array(
          z.object({
            id: z.string().optional(),
            profileId: z.string().optional(),
            name: z.string().min(1, "Name is required"),
            issuer: z.string().min(1, "Issuer is required"),
            fileUrl: z.string().optional(),
            fileBase64: z.string().optional(),
            fileName: z.string().optional(),
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
