"use client"

import ProfiecienyScale from "@/components/common/ProfiecienyScale"
import { Card } from "@/components/ui/card"
import AlumniCoreSkills from "./AlumniCoreSkills"
import AlumniToolsTechnology from "./AlumniToolsTechnology"
import { useAuthContext } from "@/context/AuthContext"

const AlumniProfileAbout = () => {
  const { user } = useAuthContext();
  return (
    <Card className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-4 text-2xl font-bold text-[#1A216D]">About</h2>
      <p className="mb-8 text-sm leading-relaxed text-gray-700">
       {user?.profile?.aboutMe || ""}
      </p>

      <h2 className="mb-6 text-2xl font-bold text-[#1A216D]">Skills</h2>

      <div className="space-y-6">
        {/* Core Skills */}
        <AlumniCoreSkills skills={user?.profile?.skills || []} />

        {/* Tools & Technology */}
        <AlumniToolsTechnology skills={user?.profile?.skills || []} />
      </div>

      {/* Proficiency Scale */}
      <ProfiecienyScale />
    </Card>
  )
}

export default AlumniProfileAbout
