"use client";

import { AlumniStudentCard } from "@/constants/alumni"
import { mentorshipService } from "@/services/mentorship.service"
import { Row } from "@tanstack/react-table"
import { UserCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MenteeCard({ row }: {row: Row<AlumniStudentCard>}) {
  const mentee = row.original
  const initials = mentee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const router = useRouter()

  const handleEndMentorship = async () => {
    try {
      const response = await mentorshipService.endMentorship({
        mentorshipId: mentee.recordId,
      })

      if (response.status === "success") {
        console.log("ended")
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to end mentorship", error)
    } 
  }

  return (
    <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
          {mentee.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mentee.profilePicture}
              alt={mentee.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-base font-bold text-[#1A216D]/60">
              {initials}
            </span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold leading-tight text-[#1A216D]">
            {mentee.name}
          </p>
          <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#4F5EBD]">
            {mentee.track}
          </p>
          <p className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
            {mentee.year}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          id={`view-profile-mentee-${mentee.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
          onClick={() => router.push(`/alumni/profile/view/${mentee.id}`)}
        >
          <UserCircle2 className="h-3.5 w-3.5" />
          View Profile
        </button>
        <button
          id={`end-mentorship-${mentee.recordId}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#793A3A] bg-white px-3 py-1.5 text-xs font-semibold text-[#793A3A] transition-all duration-200 hover:border-red-400 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
          onClick={handleEndMentorship}
        >
          <XCircle className="h-3.5 w-3.5" />
          End Mentorship
        </button>
      </div>
    </div>
  )
}