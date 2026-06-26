export function formatCandidates(students: any[], querySkills: string[] = []) {
  return students
    .map((profile) => {
      const skills = profile.skills.map((skill: any) => {
        const isMatch = querySkills.includes(skill.name);

        return {
          name: skill.name,
          level: skill.level ?? 0,
          description: skill.description,
          match: isMatch,
        };
      });

      // scoring logic
      let score = 0;

      // Weighted linear scoring (heuristic ranking system)

      for (const skill of skills) {
        if (skill.match) {
          score += 10; // base match deafult value 
          score += (skill.level ?? 0) * 5; // experience weight kay 5 ang max na value
        }
      }

      // normalize
      score = querySkills.length ? score / querySkills.length : 0;

      return {
        id: profile.userId,
        name: profile.fullName,
        bio: profile.work_field ?? profile.current_position ?? "",
        skills: querySkills.length ? skills.filter((s: any) => s.match) : skills,
        score: Math.min(score, 100),
      };
    })
    .sort((a, b) => b.score - a.score); // IMPORTANT: ranking here
}
