import SkillCategory from "./SkillCategory";
import ProficiencyLegend from "./ProficiencyLegend";

interface Props {
  skills: SkillCategoryType[];
}

export default function SkillsSection({
  skills,
}: Props) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold text-[#1A216D]">
        Skills
      </h2>

      <div className="space-y-8">
        {skills.map((category) => (
          <SkillCategory
            key={category.title}
            category={category}
          />
        ))}

        <ProficiencyLegend />
      </div>
    </>
  );
}