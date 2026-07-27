import { z } from "zod";

export const approveAlumniRequestSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, "Student ID is required"),
  }),
});

export const rejectAlumniRequestSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, "Student ID is required"),
  }),
});

export type ApproveAlumniRequestSchemaTypes = z.infer<typeof approveAlumniRequestSchema>;
export type RejectAlumniRequestSchemaTypes = z.infer<typeof rejectAlumniRequestSchema>;
