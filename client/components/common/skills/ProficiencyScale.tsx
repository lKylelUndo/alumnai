import { getProficiencyColor } from "@/utils/skill"

const LEVELS = [
  { level: 1, label: "Beginner" },
  { level: 2, label: "Basic" },
  { level: 3, label: "Intermediate" },
  { level: 4, label: "Advanced" },
  { level: 5, label: "Expert" },
] as const

const ProfiecienyScale = () => {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Proficiency Scale
      </h4>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {LEVELS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full ring-1 ring-foreground/10"
              style={{ backgroundColor: getProficiencyColor(item.level) }}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ProfiecienyScale
