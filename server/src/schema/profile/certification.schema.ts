import { z } from "zod";

export const certificationIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Certification ID is required"),
  }),
});

export const setCertificationVisibilitySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Certification ID is required"),
  }),
  body: z.object({
    isVisible: z.boolean({ message: "isVisible must be a boolean" }),
  }),
});

export type CertificationIdParamTypes = z.infer<typeof certificationIdParamSchema>["params"];
export type SetCertificationVisibilityInputTypes = z.infer<
  typeof setCertificationVisibilitySchema
>["body"];
