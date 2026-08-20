import { z } from "zod";

export const recognizeAlumniSchema = z.object({
  body: z.object({
    toAlumniId: z.string().min(1, "Alumni ID is required"),
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(1000, "Message cannot exceed 1000 characters"),
  }),
});

export type RecognizeAlumniTypes = z.infer<typeof recognizeAlumniSchema>["body"];
