"use client"

import { useState } from "react"
import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus } from "lucide-react"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import AlumniCoreSkills from "./AlumniCoreSkills"
import AlumniToolsTechnology from "./AlumniToolsTechnology"
import SkillManageDialog from "@/components/common/dialogs/SkillManageDialog"
import AddTechOrToolsDialog from "@/components/common/dialogs/AddTechOrToolsDialog"
import { useAuthContext } from "@/context/AuthContext"
import { authService } from "@/services/auth.service"
import { skillService } from "@/services/skill.service"
import { profileService } from "@/services/profile.service"
import { toast } from "sonner"
import { Skill, AddSkillInput } from "@/schema/skill"

const AlumniProfileSkills = () => {
  const { user, setUser } = useAuthContext();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const handleDeleted = async () => {
    try {
      const meResponse = await authService.getMe()
      if (meResponse.code === 200) {
        setUser(meResponse.data.user)
        localStorage.setItem("user", JSON.stringify(meResponse.data.user))
      }
    } catch {
      // toast already shown in dialog
    }
  }

  const handleQuickAdd = async (data: {
    skill: Omit<AddSkillInput, "profileId"> | null
    softSkillTags: string[]
    otherHardSkillTags: string[]
    certifications: Array<{
      name: string
      issuer: string
      fileBase64?: string
      fileName?: string
    }>
  }) => {
    const profileId = user?.profile?.id
    if (!profileId || !user) {
      toast.error("Could not determine your profile. Please reload and try again.")
      return
    }
    try {
      const payloads = [
        ...(data.skill ? [{ ...data.skill, profileId }] : []),
        ...data.softSkillTags.map((name) => ({ profileId, name, type: "SOFT_SKILL" as const })),
        ...data.otherHardSkillTags.map((name) => ({ profileId, name, type: "OTHER_HARD_SKILL" as const })),
      ]
      if (payloads.length > 0) {
        await Promise.all(payloads.map((payload) => skillService.addSkill(payload)))
      }
      if (data.certifications.length > 0) {
        await profileService.updateProfile({ userId: user.id, certifications: data.certifications })
      }
      const meResponse = await authService.getMe()
      if (meResponse.code === 200) {
        setUser(meResponse.data.user)
        localStorage.setItem("user", JSON.stringify(meResponse.data.user))
      }
      toast.success(payloads.length > 0 ? "Skill added successfully" : "Certification added successfully")
    } catch (error) {
      console.error("Failed to add skill:", error)
      toast.error("Failed to add skill")
    }
  }

  return (
    <Card className="rounded-2xl p-6 md:p-8">
      <ProfileCardHeader
        icon={Sparkles}
        title="Skills"
        action={
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Skill
          </Button>
        }
      />

      <div className="space-y-8">
        <AlumniCoreSkills skills={user?.profile?.skills || []} onSelect={setSelectedSkill} />
        <AlumniToolsTechnology skills={user?.profile?.skills || []} onSelect={setSelectedSkill} />
      </div>

      <ProfiecienyScale />

      <SkillManageDialog
        skill={selectedSkill}
        open={!!selectedSkill}
        onOpenChange={(open) => {
          if (!open) setSelectedSkill(null)
        }}
        onDeleted={handleDeleted}
      />

      <AddTechOrToolsDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        skills={user?.profile?.skills ?? []}
        onSave={handleQuickAdd}
      />
    </Card>
  )
}

export default AlumniProfileSkills
