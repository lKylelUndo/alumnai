"use client"

import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skill } from "@/schema/skill"
import { skillService } from "@/services/skill.service"
import { getProficiencyColor } from "@/utils/skill"

const TYPE_LABELS: Record<Skill["type"], string> = {
  SOFT_SKILL: "Core Skill",
  HARD_SKILL: "Tool / Technology",
  OTHER_HARD_SKILL: "Other Skill",
}

interface SkillManageDialogProps {
  skill: Skill | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: (skillId: string) => void
}

export default function SkillManageDialog({
  skill,
  open,
  onOpenChange,
  onDeleted,
}: SkillManageDialogProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleOpenChange = (next: boolean) => {
    if (!next) setConfirming(false)
    onOpenChange(next)
  }

  const handleDelete = async () => {
    if (!skill) return
    // first tap arms the confirm state, second tap executes
    if (!confirming) {
      setConfirming(true)
      return
    }
    try {
      setDeleting(true)
      await skillService.removeSkill({ id: skill.id })
      toast.success("Skill deleted")
      onDeleted(skill.id)
      setConfirming(false)
      onOpenChange(false)
    } catch {
      toast.error("Failed to delete skill")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary">
            Skill details
          </DialogTitle>
          <DialogDescription>
            View or remove this skill from your profile.
          </DialogDescription>
        </DialogHeader>

        {skill && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                {skill.name}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {TYPE_LABELS[skill.type]}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: getProficiencyColor(skill.level) }}
              />
              Proficiency: {skill.level}
            </div>

            {skill.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {skill.description}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                variant="destructive"
                className="h-11 w-full"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                  </>
                ) : confirming ? (
                  "Tap again to confirm delete"
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete skill
                  </>
                )}
              </Button>
              {confirming && !deleting && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full"
                  onClick={() => setConfirming(false)}
                >
                  Keep skill
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
