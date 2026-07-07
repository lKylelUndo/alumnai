import { Skill } from "@/types/profile";

const colors = {
  Beginner: "bg-red-500",
  Basic: "bg-orange-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-emerald-500",
  Expert: "bg-green-600",
};

interface Props {
  skill: Skill;
}

export default function SkillBadge({
  skill,
}: Props) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-slate-100 px-5 py-2">

      <span className="text-sm font-medium text-[#1A216D]">
        {skill.name}
      </span>

      <span
        className={`h-2.5 w-2.5 rounded-full ${colors[skill.level]}`}
      />
    </div>
  );
}