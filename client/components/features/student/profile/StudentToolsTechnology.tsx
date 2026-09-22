import { Skill } from "@/schema/skill"
import { getProficiencyColor } from "@/utils/skill"

const StudentToolsTechnology = ({
  skills,
  onSelect,
}: {
  skills: Skill[]
  onSelect: (skill: Skill) => void
}) => {
  const hardSkills = skills.filter(( skill ) => skill.type === "HARD_SKILL")
  const otherHardSkills = skills.filter(( skill ) => skill.type === "OTHER_HARD_SKILL")

  return (
    <>
      {/* Tools & Technology */}
      <div>
        <h3 className="text-sm font-semibold text-[#131b2e] mb-3 border-b border-[#E2E8F0] pb-2">
          Tools & Technology
        </h3>
        {hardSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hardSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => onSelect(skill)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F1F5F9] px-4 py-2 text-xs font-semibold text-[#434657] transition hover:bg-[#E2E8F0] active:scale-95"
              >
                {skill.name}
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: getProficiencyColor(skill.level) }}
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#434657] italic py-2">No tools added yet</p>
        )}
      </div>

      {/* Others */}
      <div>
        <h3 className="text-sm font-semibold text-[#131b2e] mb-3 border-b border-[#E2E8F0] pb-2">Others</h3>
        {otherHardSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {otherHardSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => onSelect(skill)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F1F5F9] px-4 py-2 text-xs font-semibold text-[#434657] transition hover:bg-[#E2E8F0] active:scale-95"
              >
                {skill.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#434657] italic py-2">
            No other skills added yet
          </p>
        )}
      </div>
    </>
  )
}

export default StudentToolsTechnology
