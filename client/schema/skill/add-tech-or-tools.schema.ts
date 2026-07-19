import { z } from "zod"

export const PROFICIENCY_OPTIONS = [
  { label: "Beginner", value: "20", color: "#ef4444" },
  { label: "Elementary", value: "40", color: "#f97316" },
  { label: "Intermediate", value: "60", color: "#f59e0b" },
  { label: "Advanced", value: "80", color: "#3b82f6" },
  { label: "Expert", value: "100", color: "#22c55e" },
] as const

export const certificationRowSchema = z.object({
  name: z.string().optional(),
  issuer: z.string().optional(),
  fileBase64: z.string().optional(),
  fileName: z.string().optional(),
})

export type CertificationRow = z.infer<typeof certificationRowSchema>

export const addTechOrToolsSchema = z.object({
  name: z.string().optional(),
  level: z.string().optional(),
  description: z.string().optional(),
  certifications: z.array(certificationRowSchema).optional(),
})

export type AddTechOrToolsFormValues = z.infer<typeof addTechOrToolsSchema>

export interface SkillPayload {
  profileId?: string
  name: string
  level?: number
  description?: string
  type: "HARD_SKILL" | "SOFT_SKILL" | "OTHER_HARD_SKILL"
}

export interface CertificationPayload {
  name: string
  issuer: string
  fileBase64?: string
  fileName?: string
}

export interface AddTechOrToolsSaveData {
  skill: SkillPayload
  certifications: CertificationPayload[]
  techTags: string[]
  coreSkills: string[]
  otherSkills: string[]
}

export interface AddTechOrToolsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  techTags: string[]
  coreSkills: string[]
  otherSkills: string[]
  onSave: (data: AddTechOrToolsSaveData) => void
}
