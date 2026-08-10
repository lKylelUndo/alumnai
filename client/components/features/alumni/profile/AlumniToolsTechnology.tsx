import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skill } from "@/schema/skill"
import { getProficiencyColor } from "@/utils/skill"

const AlumniToolsTechnology = ({ skills }: { skills: Skill[] }) => {
  const hardSkills = skills.filter(( skill ) => skill.type === "HARD_SKILL")
  const otherHardSkills = skills.filter(( skill ) => skill.type === "OTHER_HARD_SKILL")

  return (
    <div>
      {/* Tools & Technology */}
      <h3 className="mb-3 text-sm font-semibold text-gray-800">
        Tools & Technology
      </h3>
      <div className="flex flex-wrap gap-2">
        {hardSkills.length > 0 ? (
          hardSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700"
            >
              {skill.name}
              {skill.description && (
                <Tooltip>
                  <TooltipTrigger className="h-2 w-2 rounded-full" style={{backgroundColor: getProficiencyColor(skill.level)}} />
                  <TooltipContent>
                    <p>{skill.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </span>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No tools added yet</p>
        )}
      </div>

      {/* Others */}
      <h3 className="my-3 text-sm font-semibold text-gray-800">Others</h3>
      <div className="flex flex-wrap gap-2">
        {otherHardSkills.length > 0 ? (
          otherHardSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700"
            >
              {skill.name}
              {skill.description && (
                <Tooltip>
                  <TooltipContent>
                    <p>{skill.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </span>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            No other skills added yet
          </p>
        )}
      </div>
    </div>
  )
}

export default AlumniToolsTechnology