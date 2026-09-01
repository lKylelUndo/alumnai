"use client"

import { Card } from "@/components/ui/card"
import { useAuthContext } from "@/context/AuthContext"

const AlumniProfileAbout = () => {
  const { user } = useAuthContext();
  return (
    <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <h2 className="font-bold text-[#131b2e] text-2xl mb-4">About</h2>
      <p className="text-[#434657] leading-relaxed">
       {user?.profile?.aboutMe || "No bio provided."}
      </p>
    </Card>
  )
}

export default AlumniProfileAbout
