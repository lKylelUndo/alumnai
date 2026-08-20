import { z } from "zod";

export const recognizeAlumniSchema = z.object({
  toAlumniId: z.string().min(1, "Alumni ID is required"),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type RecognizeAlumniInput = z.infer<typeof recognizeAlumniSchema>;
