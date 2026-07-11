import { z } from "zod";

export const PROFICIENCY_OPTIONS = [
  { label: "Beginner",     value: "20",  color: "#ef4444" },
  { label: "Elementary",   value: "40",  color: "#f97316" },
  { label: "Intermediate", value: "60",  color: "#f59e0b" },
  { label: "Advanced",     value: "80",  color: "#3b82f6" },
  { label: "Expert",       value: "100", color: "#22c55e" },
] as const;

export const certificationRowSchema = z.object({
  name:       z.string().optional(),
  issuer:     z.string().optional(),
  fileBase64: z.string().optional(), // file stored as base64 data URL
  fileName:   z.string().optional(),
});

export type CertificationRow = z.infer<typeof certificationRowSchema>;


export const addTechOrToolsSchema = z.object({
  name: z.string().min(1, "Tech/Tool name is required"),
  level: z.string().min(1, "Proficiency level is required"),
  description: z.string().optional(),
  others: z.string().optional(),


  certifications: z.array(certificationRowSchema).optional(),
});

export type AddTechOrToolsFormValues = z.infer<typeof addTechOrToolsSchema>;

export interface SkillPayload {
  name:         string;
  level:        number; // 0–100, derived from PROFICIENCY_OPTIONS
  description?: string;
  type:         "HARD_SKILL";
}

/** A single certification record for Profile.certifications JSON field */
export interface CertificationPayload {
  name:        string;
  issuer:      string;
  fileBase64?: string;
  fileName?:   string;
}

/** Full data shape returned by the dialog's onSave callback */
export interface AddTechOrToolsSaveData {
  skill:          SkillPayload;
  certifications: CertificationPayload[];
  techTags:       string[]; // merged tag list (existing + new skill name + others)
}

export interface AddTechOrToolsDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  techTags:     string[];
  onSave:       (data: AddTechOrToolsSaveData) => void;
}
