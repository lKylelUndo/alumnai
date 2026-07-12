import { z } from "zod";

export const updateProfileSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  profilePicture: z.string().optional(),
  graduationYear: z.string().optional(),
  coreSkills: z.array(z.string()).optional(),
  yearLevel: z.string().optional(),
  fullName: z.string().optional(),
  work_field: z.string().optional(),
  socialLinks: z.string().optional(),
  companyName: z.string().optional(),
  current_position: z.string().optional(),
  certifications: z.array(z.string()).optional(),
}).refine(
  (data) => {
    const { userId, ...rest } = data;
    return Object.values(rest).some((val) => val !== undefined && val !== null && val !== "");
  },
  { message: "At least one field is required to update" }
);

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
