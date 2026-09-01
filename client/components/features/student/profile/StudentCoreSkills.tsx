import { Skill } from "@/schema/skill"

const StudentCoreSkills = ({ skills }: { skills: Skill[] }) => {
  const coreSkills = skills.filter((skill) => skill.type === "SOFT_SKILL")

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#131b2e] mb-3 border-b border-[#E2E8F0] pb-2">Core Skills</h3>
      {coreSkills.length === 0 ? (
        <p className="text-sm text-[#434657] italic py-2">
          No core skills added yet
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {coreSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex rounded-md bg-[#dde1ff] px-4 py-1.5 text-xs font-semibold text-[#1A216D]"
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentCoreSkills
