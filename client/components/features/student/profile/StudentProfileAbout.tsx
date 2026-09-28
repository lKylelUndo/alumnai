"use client"

import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import { useAuthContext } from "@/context/AuthContext"

const StudentProfileAbout = () => {
  const { user } = useAuthContext();

  return (
    <Card className="rounded-2xl p-6 md:p-8">
      <ProfileCardHeader icon={User} title="About" />
      <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
        {user?.profile?.aboutMe || "No bio provided."}
      </p>
    </Card>
  )
}

export default StudentProfileAbout
