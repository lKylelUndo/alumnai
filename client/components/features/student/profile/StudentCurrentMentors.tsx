"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
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
    <Card className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#e0e0ff] text-[#1877F2] flex items-center justify-center">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-[#131b2e]">Current Mentors</h2>
          <p className="text-sm text-[#434657]">
            {loading
              ? "Loading mentors..."
              : mentors.length > 0
              ? `Currently have ${mentors.length} mentor${mentors.length > 1 ? "s" : ""}`
              : "No active mentors connected yet"}
          </p>
        </div>
      </div>

      {mentors.length > 0 && (
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.toAlumniId}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F1F5F9] transition-colors border border-transparent hover:border-[#E2E8F0] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d2d9f4] flex items-center justify-center shrink-0">
                  {mentor.profilePicture ? (
                    <Image
                      src={mentor.profilePicture}
                      alt={mentor.fullName}
                      width={40}
                      height={40}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-[#A4B1CC]" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#131b2e] leading-tight">
                    {mentor.fullName}
                  </p>
                  <p className="text-xs text-[#434657]">
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
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-[#434657]">
          <Users className="h-10 w-10 mb-2 text-[#A4B1CC]/50" />
          <p className="text-sm italic">No active mentors connected yet.</p>
        </div>
      )}
    </Card>
  )
}

export default StudentCurrentMentors
