import { Row } from "@tanstack/react-table"
import { Collaborator } from "@/components/features/alumni/find-collaborators/FindCollaborators"
import { Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

const VISIBLE_SKILLS = 2

export default function CollaboratorCard({ row }: { row: Row<Collaborator> }) {
  const collaborator = row.original

  console.log("cardz", collaborator);
  const initials = collaborator.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const visibleSkills = collaborator.skills.slice(0, VISIBLE_SKILLS)

  const router = useRouter();

  return (
    <div className="group relative rounded-2xl border border-[#E2E6F3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A216D]/30 hover:shadow-lg hover:shadow-[#1A216D]/10">
      {/* Hover accent top line */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl duration-300 group-hover:opacity-100" />

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
                <User className="h-6 w-6" />
              </span>
            )}
          </div>

          {/* Name / Track / Year */}
          <div>
            <p className="text-sm leading-tight font-bold text-[#1A216D]">
              {collaborator.name}
            </p>
            <p className="mt-0.5 pr-3 text-xs font-semibold text-justify text-[#4F5EBD]">
              {collaborator.aboutMe?.substring(0, 50) + "..."}
            </p>
          </div>
        </div>

        {/* View Button */}
        <Button 
          id={`view-collaborator-${collaborator.id}`}
          variant={"default"}
          className="rounded-full"
          onClick={() => router.push(`/alumni/profile/view/${collaborator.id}`)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
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
