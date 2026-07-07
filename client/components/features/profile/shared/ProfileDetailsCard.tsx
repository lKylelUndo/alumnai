import AboutSection from "@/components/features/profile/shared/AboutSection";
import SkillsSection from "@/components/features/profile/shared/SkillsSection";

interface Props {
  about: string;
  skills: SkillCategoryType[];
}

export default function ProfileDetailsCard({
  about,
  skills,
}: Props) {
  return (
    <section className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">

      {/* About */}
      <AboutSection about={about} />

      {/* Skills */}

      <div className="mt-10">
        <SkillsSection skills={skills} />
      </div>

    </section>
  );
}