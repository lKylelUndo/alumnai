import { Skill } from "@/schema/skill"

const StudentCoreSkills = ({
  skills,
  onSelect,
}: {
  skills: Skill[]
  onSelect: (skill: Skill) => void
}) => {
  const coreSkills = skills.filter((skill) => skill.type === "SOFT_SKILL")

  return (
    <div>
      <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">Core Skills</h3>
      {coreSkills.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No core skills added yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {coreSkills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => onSelect(skill)}
              className="inline-flex cursor-pointer rounded-md bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15 active:scale-95"
            >
              {skill.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentCoreSkills
