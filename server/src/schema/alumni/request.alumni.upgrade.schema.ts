import { z } from "zod";

export const requestAlumniUpgradeSchema = z.object({
  body: z.object({
    documentUrl: z.string().min(1, "Document URL is required"),
  }),
});

export type RequestAlumniUpgradeSchemaTypes = z.infer<typeof requestAlumniUpgradeSchema>;
