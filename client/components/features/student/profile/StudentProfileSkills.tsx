"use client"

import { useState } from "react"
import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import StudentCoreSkills from "./StudentCoreSkills"
import StudentToolsTechnology from "./StudentToolsTechnology"
import SkillManageDialog from "@/components/common/dialogs/SkillManageDialog"
import { useAuthContext } from "@/context/AuthContext"
import { authService } from "@/services/auth.service"
import { Skill } from "@/schema/skill"

const StudentProfileSkills = () => {
  const { user, setUser } = useAuthContext();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

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

  return (
    <Card className="rounded-2xl p-6 md:p-8">
      <ProfileCardHeader icon={Sparkles} title="Skills" />

      <div className="space-y-8">
        <StudentCoreSkills skills={user?.profile?.skills || []} onSelect={setSelectedSkill} />
        <StudentToolsTechnology skills={user?.profile?.skills || []} onSelect={setSelectedSkill} />
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
    </Card>
  )
}

export default StudentProfileSkills
