import { Skill } from "@/schema/skill"

const StudentCoreSkills = ({ skills }: { skills: Skill[] }) => {
  const coreSkills = skills.filter((skill) => skill.type === "SOFT_SKILL")

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-800">Core Skills</h3>
      <div className="flex flex-wrap gap-2">
        {coreSkills.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No core skills added yet
          </p>
        ) : (
          coreSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex rounded-md bg-[#F0F4FF] px-4 py-1.5 text-xs font-semibold text-[#1A216D]"
            >
              {skill.name}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default StudentCoreSkills
