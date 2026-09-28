"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import ProfileCardHeader from "@/components/common/profile/ProfileCardHeader"
import { Users, User } from "lucide-react"
import { mentorshipService } from "@/services/mentorship.service"
import Image from "next/image"

interface Mentor {
  toAlumniId: string
  fullName: string
  currentPosition?: string | null
  companyName?: string | null
  profilePicture?: string | null
}

const StudentCurrentMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await mentorshipService.getMyMentors()
        if (res.status === "success" && Array.isArray(res.data)) {
          setMentors(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch mentors:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMentors()
  }, [])

  return (
    <Card className="rounded-2xl p-6">
      <ProfileCardHeader
        icon={Users}
        title="Current Mentors"
        description={
          loading
            ? "Loading mentors..."
            : mentors.length > 0
            ? `Currently have ${mentors.length} mentor${mentors.length > 1 ? "s" : ""}`
            : "No active mentors connected yet"
        }
      />

      {mentors.length > 0 && (
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.toAlumniId}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {mentor.profilePicture ? (
                    <Image
                      src={mentor.profilePicture}
                      alt={mentor.fullName}
                      width={40}
                      height={40}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight text-foreground">
                    {mentor.fullName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {mentor.currentPosition || "Mentor"}
                    {mentor.companyName ? ` @ ${mentor.companyName}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && mentors.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <Users className="mb-2 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm">No active mentors connected yet.</p>
        </div>
      )}
    </Card>
  )
}

export default StudentCurrentMentors
