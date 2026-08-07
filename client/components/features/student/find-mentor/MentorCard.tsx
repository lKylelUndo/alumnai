import { Row } from "@tanstack/react-table"
import { Collaborator } from "@/components/features/alumni/find-collaborators/FindCollaborators"
import { Eye } from "lucide-react"

const VISIBLE_SKILLS = 2

export default function MentorCard({ row }: { row: Row<Collaborator> }) {
  const collaborator = row.original
  const initials = collaborator.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const visibleSkills = collaborator.skills.slice(0, VISIBLE_SKILLS)
  // const extraCount = collaborator.skills.length - VISIBLE_SKILLS

  return (
    <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
      {/* Hover accent top line */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-[#1A216D] to-[#4F5EBD] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
            {collaborator.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={collaborator.profilePicture}
                alt={collaborator.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#1A216D]/60">
                {initials}
              </span>
            )}
          </div>

          {/* Name / Track / Year */}
          <div>
            <p className="text-sm leading-tight font-bold text-[#1A216D]">
              {collaborator.name}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#4F5EBD]">
              {collaborator.bio}
            </p>

            <p className="mt-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
              Match Score: {collaborator.score}
            </p>
          </div>
        </div>

        {/* View Button */}
        <button
          id={`view-collaborator-${collaborator.id}`}
          className="flex items-center gap-1.5 rounded-full border border-[#E2E6F3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A216D] transition-all duration-200 hover:border-[#1A216D] hover:bg-[#1A216D] hover:text-white active:scale-95"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      </div>

      {/* Skills */}
      {collaborator.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <span
              key={skill.name}
              className="inline-flex items-center rounded-full border border-[#E2E6F3] bg-[#F5F6FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#1A216D]"
            >
              {skill.name} ({skill.level}/5)
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
