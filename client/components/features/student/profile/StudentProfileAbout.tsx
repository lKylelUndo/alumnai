"use client"

import ProfiecienyScale from "@/components/common/ProficiencyScale"
import { Card } from "@/components/ui/card"
import StudentCoreSkills from "./StudentCoreSkills"
import StudentToolsTechnology from "./StudentToolsTechnology"
import { useAuthContext } from "@/context/AuthContext"

const StudentProfileAbout = () => {
  const { user } = useAuthContext();
  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-4 text-2xl font-bold text-[#1A216D]">About</h2>
      <p className="mb-8 text-sm leading-relaxed text-gray-700">
       {user?.profile?.aboutMe || ""}
      </p>

      <h2 className="mb-6 text-2xl font-bold text-[#1A216D]">Skills</h2>

      <div className="space-y-6">
        {/* Core Skills */}
        <StudentCoreSkills skills={user?.profile?.skills || []}/>

        {/* Tools & Technology */}
        <StudentToolsTechnology skills={user?.profile?.skills || []}/>
      </div>

      {/* Proficiency Scale */}
      <ProfiecienyScale />
    </Card>
  )
}

export default StudentProfileAbout
