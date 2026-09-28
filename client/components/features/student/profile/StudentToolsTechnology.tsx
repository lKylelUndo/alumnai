import { Skill } from "@/schema/skill"
import { getProficiencyColor, getProficiencyLabel } from "@/utils/skill"

const StudentToolsTechnology = ({
  skills,
  onSelect,
}: {
  skills: Skill[]
  onSelect: (skill: Skill) => void
}) => {
  const hardSkills = skills.filter((skill) => skill.type === "HARD_SKILL")
  const otherHardSkills = skills.filter((skill) => skill.type === "OTHER_HARD_SKILL")

  return (
    <>
      <div>
        <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">
          Tools &amp; Technology
        </h3>
        {hardSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hardSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => onSelect(skill)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted/70 active:scale-95"
              >
                {skill.name}
                <span
                  role="img"
                  aria-label={getProficiencyLabel(skill.level)}
                  title={getProficiencyLabel(skill.level)}
                  className="h-2 w-2 shrink-0 rounded-full ring-1 ring-foreground/10"
                  style={{ backgroundColor: getProficiencyColor(skill.level) }}
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="py-2 text-sm text-muted-foreground">No tools added yet</p>
        )}
      </div>

      <div>
        <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold text-foreground">Others</h3>
        {otherHardSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {otherHardSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => onSelect(skill)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted/70 active:scale-95"
              >
                {skill.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-2 text-sm text-muted-foreground">No other skills added yet</p>
        )}
      </div>
    </>
  )
}

export default StudentToolsTechnology
