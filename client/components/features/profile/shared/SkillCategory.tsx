import { SkillCategory as SkillCategoryType } from "@/types/profile";
import SkillBadge from "./SkillBadge";
import ProficiencyBadge from "./ProficiencyBadge";

interface Props {
  category: SkillCategoryType;
}

export default function SkillCategory({
  category,
}: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[#1A216D]">
        {category.title}
      </h3>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-3">
    {category.skills.map((skill) => (
        <SkillBadge key={skill.id} skill={skill} />
    ))}
</div>
      </div>
    </div>
  );
}