import type { LucideIcon } from "lucide-react"
import { BadgeCheckIcon, Sparkles, UserRoundIcon } from "lucide-react"
import type { FieldPath } from "react-hook-form"
import type { z } from "zod"

import { updateProfileSchema } from "@/schema/profile"

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>

export interface ProfileStep {
  id: "personal" | "skills" | "certifications"
  /** Short form for the step indicator. */
  label: string
  /** Long form for the section heading. */
  heading: string
  description: string
  icon: LucideIcon
  /**
   * The form paths this step owns. Continue runs `form.trigger()` against
   * exactly this list, so a step never blocks on another step's fields.
   */
  fields: FieldPath<UpdateProfileValues>[]
}

/**
 * Builds the step model for the current role. The alumni and student forms
 * expose different optional fields, so the validated path list has to follow
 * the role rather than being a static constant.
 */
export const createProfileSteps = (userRole: string): ProfileStep[] => {
  const isAlumni = userRole === "ALUMNI"

  const personalFields: FieldPath<UpdateProfileValues>[] = [
    "userId",
    "profilePicture",
    "fullName",
    "work_field",
    isAlumni ? "graduatedYear" : "yearLevel",
    "companyName",
    "current_position",
    "aboutMe",
    "socialLink",
    isAlumni ? "isAvailableForMentorship" : "isAvailableForCollaboration",
  ]

  return [
    {
      id: "personal",
      label: "Personal Details",
      heading: "Personal Details",
      description:
        "Your photo and the basics the school will see on your profile.",
      icon: UserRoundIcon,
      fields: personalFields,
    },
    {
      id: "skills",
      label: "Skills",
      heading: "Skills",
      description:
        "Tools you work with, plus the core and other skills that go with them.",
      icon: Sparkles,
      // Skills live in the form component's own staged state, not in
      // react-hook-form, so this step has nothing to validate.
      fields: [],
    },
    {
      id: "certifications",
      label: "Certifications",
      heading: "Certifications",
      description: "Certificates and supporting files for your profile.",
      icon: BadgeCheckIcon,
      fields: ["certifications"],
    },
  ]
}

/* ── Shared look ──────────────────────────────────────────────────────────
   The same control treatment as the profile skill dialog, so moving between
   the two flows does not feel like a different product. */

export const PROFILE_CONTROL_CLASS =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-base transition-colors placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-3 focus-visible:ring-primary/15 md:text-sm"

/* SkillAutocomplete renders its own input shell; drop its shadow so it sits
   flush beside the shadcn Inputs instead of reading as raised. */
export const PROFILE_AUTOCOMPLETE_CLASS = `${PROFILE_CONTROL_CLASS} shadow-none`

export const PROFILE_LABEL_CLASS = "text-sm font-semibold text-primary"

/* Field only receives data-invalid, so mirror that onto the control itself —
   otherwise the red FieldError is the only error signal on screen. */
export const PROFILE_FIELD_CLASS =
  "data-[invalid=true]:[&_input]:border-destructive/50"

export const PROFILE_TAG_CLASS =
  "flex items-center gap-1 rounded-full border border-border/70 bg-muted py-0.5 pr-0.5 pl-2.5 text-xs font-medium text-foreground"

export const PROFILE_TAG_REMOVE_CLASS =
  "-my-1 flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-primary/20"

export const PROFILE_ADD_BUTTON_CLASS =
  "flex size-11 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/20"

export const PROFILE_ICON_BUTTON_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/20"

export const PROFILE_DANGER_ICON_BUTTON_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive focus-visible:ring-3 focus-visible:ring-primary/20"

export const PROFILE_RULE_CLASS =
  "h-px w-full border-t border-dashed border-border/70"
