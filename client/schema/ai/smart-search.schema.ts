import { z } from "zod";

export const smartSearchSchema = z.object({
  rawSearch: z.string().min(1, "Search query is required"),
});

export type SmartSearchInput = z.infer<typeof smartSearchSchema>;
