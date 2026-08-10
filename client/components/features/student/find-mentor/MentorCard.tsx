import { Row } from "@tanstack/react-table"
import { Mentor } from "@/components/features/student/find-mentor/FindMentors"
import { Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const VISIBLE_SKILLS = 2

export default function MentorCard({ row }: { row: Row<Mentor> }) {
  const mentor = row.original

  const name = mentor.name || "Alumni Mentor"
  const workField = mentor.work_field || "Field not specified"
  const rawAbout = mentor.aboutMe?.trim()
  const displayAbout = rawAbout
    ? rawAbout.length > 50
      ? `${rawAbout.substring(0, 50)}...`
      : rawAbout
    : "No bio available."

  const skills = mentor.skills ?? []
  const visibleSkills = skills.slice(0, VISIBLE_SKILLS)
  const router = useRouter()

  return (
    <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
      {/* Hover accent top line */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E6F3] bg-[#EEF0FB] transition-all duration-300 group-hover:border-[#1A216D]/30">
            {mentor.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mentor.profilePicture}
                alt={name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#1A216D]/60">
                <User className="h-6 w-6" />
              </span>
            )}
          </div>

          {/* Name / Field / About */}
          <div>
            <p className="text-sm leading-tight font-bold text-[#1A216D]">
              {name}
            </p>
            <p className="text-[11px] font-medium text-gray-500">
              {workField}
            </p>
            <p className="mt-0.5 pr-3 text-xs font-semibold text-justify text-[#4F5EBD]">
              {displayAbout}
            </p>
          </div>
        </div>

        {/* View Button */}
        <Button
          id={`view-mentor-${mentor.id}`}
          variant={"default"}
          className="rounded-full"
          onClick={() => router.push(`/student/profile/view/${mentor.id}`)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {visibleSkills.length > 0 ? (
          visibleSkills.map((skill) => (
            <span
              key={skill.name}
              className="inline-flex items-center rounded-full border border-[#E2E6F3] bg-[#F5F6FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#1A216D]"
            >
              {skill.name} ({skill.level}/5)
            </span>
          ))
        ) : (
          <span className="inline-flex items-center rounded-full border border-[#E2E6F3]/60 bg-[#F5F6FC]/60 px-2.5 py-0.5 text-[11px] italic text-gray-400">
            No skills listed
          </span>
        )}
      </div>
    </div>
  )
}
