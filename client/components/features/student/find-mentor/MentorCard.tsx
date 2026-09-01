import { Row } from "@tanstack/react-table"
import { Mentor } from "@/components/features/student/find-mentor/FindMentors"
import { User, Star, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const VISIBLE_SKILLS = 3

export default function MentorCard({ row }: { row: Row<Mentor> }) {
  const mentor = row.original
  const router = useRouter()

  const name = mentor.name || "Alumni Mentor"
  const position = mentor.current_position || mentor.work_field || "Alumni"
  const rawAbout = mentor.aboutMe?.trim()
  const displayAbout = rawAbout
    ? rawAbout.length > 120
      ? `${rawAbout.substring(0, 120)}...`
      : rawAbout
    : "No bio available."

  const skills = mentor.skills ?? []
  const visibleSkills = skills.slice(0, VISIBLE_SKILLS)
  const recognitionCount = mentor.recognitionCount ?? 0

  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col hover:shadow-md hover:border-[#1A216D]/20 transition-all cursor-pointer"
      onClick={() => router.push(`/student/profile/view/${mentor.id}`)}
    >
      {/* Avatar + Name + Position */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#e0e0ff] border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
          {mentor.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mentor.profilePicture}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-[#1877F2]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#131b2e] leading-tight truncate">{name}</p>
          <p className="text-xs font-semibold text-[#1877F2] truncate">{position}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-[#434657] leading-relaxed mb-4 line-clamp-3 flex-grow">
        {displayAbout}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {visibleSkills.length > 0 ? (
          visibleSkills.map((skill) => (
            <span
              key={skill.name}
              className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-semibold text-[#434657]"
            >
              {skill.name}
            </span>
          ))
        ) : (
          <span className="text-xs italic text-[#A4B1CC]">No skills listed</span>
        )}
      </div>

      {/* Recognition + View Profile */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
        {recognitionCount > 0 ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-[#434657]">
            <Star className="h-3.5 w-3.5 fill-[#FFC000] text-[#FFC000]" />
            {recognitionCount} recognition{recognitionCount !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-[#A4B1CC]">
            <Star className="h-3.5 w-3.5" />
            New Mentor
          </span>
        )}
        <span className="flex items-center gap-1 text-xs font-semibold text-[#1A216D] group-hover:gap-2 transition-all">
          View Profile <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  )
}
