import type { AddTechOrToolsSaveData, SkillPayload } from "@/schema/skill";

// ─── State types used inside UpdateProfileForm ───────────────────────────────

/** A collected skill entry ready to be submitted via /api/skill/v1/add-skill */
export type SavedSkill = SkillPayload;

/** Handler signature for the Tech or Tools dialog's onSave callback */
export type HandleDialogSave = (data: AddTechOrToolsSaveData) => void;
