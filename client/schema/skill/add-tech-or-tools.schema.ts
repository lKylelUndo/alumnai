import { z } from "zod";

// ─── Constants ──────────────────────────────────────────────────────────────
// Maps UI proficiency labels → backend Skill.level (Float? 0–100)
export const PROFICIENCY_OPTIONS = [
  { label: "Beginner",     value: "20",  color: "#ef4444" },
  { label: "Elementary",   value: "40",  color: "#f97316" },
  { label: "Intermediate", value: "60",  color: "#f59e0b" },
  { label: "Advanced",     value: "80",  color: "#3b82f6" },
  { label: "Expert",       value: "100", color: "#22c55e" },
] as const;

// ─── Certification row ───────────────────────────────────────────────────────
// Matches backend: Profile.certifications (Json? — array of cert objects)
export const certificationRowSchema = z.object({
  name:       z.string().optional(),
  issuer:     z.string().optional(),
  fileBase64: z.string().optional(), // file stored as base64 data URL
  fileName:   z.string().optional(),
});

export type CertificationRow = z.infer<typeof certificationRowSchema>;

// ─── Add Tech or Tools dialog form ──────────────────────────────────────────
// Matches backend Skill model: POST /api/skill/v1/add-skill
// Body: { profileId, type, name, level, description }
export const addTechOrToolsSchema = z.object({
  /** Skill.name */
  name: z.string().min(1, "Tech/Tool name is required"),

  /** Skill.level stored as string in the select, parsed to number on save */
  level: z.string().min(1, "Proficiency level is required"),

  /** Skill.description */
  description: z.string().optional(),

  /** Free-text "other" tool to append to the tech tags list */
  others: z.string().optional(),

  /** Profile.certifications — submitted via update-profile endpoint */
  certifications: z.array(certificationRowSchema).optional(),
});

export type AddTechOrToolsFormValues = z.infer<typeof addTechOrToolsSchema>;

// ─── Output types produced by the dialog's onSave callback ──────────────────

/** A single skill record ready to POST to /api/skill/v1/add-skill */
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

// ─── Dialog component props ──────────────────────────────────────────────────
export interface AddTechOrToolsDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  /** Current tech/tool tags already added (displayed as chips) */
  techTags:     string[];
  /** Called when the user saves the dialog form */
  onSave:       (data: AddTechOrToolsSaveData) => void;
}
