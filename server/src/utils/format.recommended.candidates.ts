export function formatCandidates(profiles: any[], querySkills?: string[]) {
  return profiles.map((profile) => {
    const base = {
      id: profile.userId,
      name: profile.fullName,
      bio: profile.work_field ?? profile.current_position ?? "",
      skills: profile.skills.map((skill: any) => ({
        name: skill.name,
        level: skill.level ?? 0,
        description: skill.description,
      })),
    };

    //  If no querySkills → return full format
    if (!querySkills || querySkills.length === 0) {
      return base;
    }

    //  AI mode → filter only matched skills
    return {
      ...base,
      skills: base.skills.filter((skill: { name: string }) =>
        querySkills.includes(skill.name),
      ),
    };
  });
}
