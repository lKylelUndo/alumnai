/**
 * Canonical IT fields / specializations used across the platform.
 * Matches the options in ProfileFormFields.tsx update-profile form.
 */
export const IT_FIELDS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "DevOps & Infrastructure",
  "Networking & Systems",
  "Data Science & AI/ML",
  "Mobile Development",
  "Cybersecurity",
  "UI/UX Design",
  "Other IT Field",
] as const

export type ITField = (typeof IT_FIELDS)[number]
