"use client"

import { AlumniStudentCardTypes } from "@/constants/alumni"
import { collaborationService } from "@/services/collaboration.service"
import { Row } from "@tanstack/react-table"
import { UserCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CollaborationCard({ row }: { row: Row<AlumniStudentCardTypes>}) {
  const collab = row.original
  const initials = collab.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const router = useRouter()
  const [ending, setEnding] = useState(false)

  const handleEndCollaboration = async () => {
    try {
      setEnding(true)
      const response = await collaborationService.endCollab({
        collaborationId: collab.recordId,
      })

      if (response.status === "success") {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to end collaboration", error)
    } finally {
      setEnding(false)
    }
  }

  return (
    <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
          {collab.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={collab.profilePicture}
              alt={collab.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-base font-bold text-[#1A216D]/60">
              {initials}
            </span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm leading-tight font-bold text-[#1A216D]">
            {collab.name}
          </p>
          <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#4F5EBD]">
            {collab.track}
          </p>
          <p className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
            {collab.year}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          id={`view-profile-collab-${collab.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
          onClick={() => router.push(`/alumni/profile/view/${collab.id}`)}
        >
          <UserCircle2 className="h-3.5 w-3.5" />
          View Profile
        </button>
        <button
          id={`end-collab-${collab.recordId}`}
          disabled={ending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#793A3A] bg-white px-3 py-1.5 text-xs font-semibold text-[#793A3A] transition-all duration-200 hover:border-red-400 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
          onClick={handleEndCollaboration}
        >
          <XCircle className="h-3.5 w-3.5" />
          {ending ? "Ending..." : "End Collaboration"}
        </button>
      </div>
    </div>
  )
}
