import { z } from "zod";

export const setRecognitionVisibilitySchema = z.object({
  params: z.object({
    recognitionId: z.string().min(1, "Recognition id is required"),
  }),
  body: z.object({
    isVisible: z.boolean(),
  }),
});

export type SetRecognitionVisibilityTypes = z.infer<
  typeof setRecognitionVisibilitySchema
>["body"];
