"use client"

import ProfiecienyScale from "@/components/common/skills/ProficiencyScale"
import { Card } from "@/components/ui/card"
import AlumniCoreSkills from "./AlumniCoreSkills"
import AlumniToolsTechnology from "./AlumniToolsTechnology"
import { useAuthContext } from "@/context/AuthContext"

const AlumniProfileSkills = () => {
  const { user } = useAuthContext();
  return (
    <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <h2 className="font-bold text-[#131b2e] text-2xl mb-6">Skills</h2>

      <div className="space-y-8">
        <AlumniCoreSkills skills={user?.profile?.skills || []} />
        <AlumniToolsTechnology skills={user?.profile?.skills || []} />
      </div>

      <ProfiecienyScale />
    </Card>
  )
}

export default AlumniProfileSkills
