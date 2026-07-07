import { SkillLevel } from "@/types/profile";

interface Props {
  level: SkillLevel;
}

const colors: Record<SkillLevel, string> = {
  Beginner: "bg-red-500",

  Basic: "bg-orange-500",

  Intermediate: "bg-yellow-500",

  Advanced: "bg-emerald-500",

  Expert: "bg-teal-600",
};

export default function ProficiencyBadge({
  level,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${colors[level]}`}
      />

      <span className="text-sm font-medium">
        {level}
      </span>
    </div>
  );
}