/**
 * formatCandidates — Stage-1 heuristic ranking for intelligent search.
 *
 * Takes raw Prisma profiles + the canonical query skills and returns lightweight
 * candidate rows, sorted best-first. This ordering is the candidate list the AI
 * re-ranks in stage 2, so it anchors the final results.
 *
 * Worked example — query ["React", "Node.js"], student has React L4, Python L5, Node.js L1:
 *   1. Tagging → React (match), Python (no match), Node.js (match)
 *   2. Scoring → React: 10 + 4×5 = 30; Node.js: 10 + 1×5 = 15; Python: 0 → total 45
 *   3. Normalize → 45 ÷ 2 (query skills) = 22.5
 *   4. Row → { id, name, bio, skills: [React, Node.js] (Python stripped), score: 22.5 }
 */
export function formatCandidates(students: any[], querySkills: string[] = []) {
  return students.map((profile) => {
      // 1. Tag every skill as match / no-match against the query set.
      // Exact, case-sensitive comparison: "React" matches, "react" or "React.js"
      // do not — which is why canonicalization upstream matters so much.
      const skills = profile.skills.map((skill: any) => {
        const isMatch = querySkills.includes(skill.name);

        return {
          name: skill.name,
          level: skill.level ?? 0, // Missing level counts as 0 — still earns the +10 base if matched.
          description: skill.description, // Passed through: this is the context the AI judges in stage 2.
          match: isMatch,
        };
      });

      // 2. Scoring logic — Weighted linear scoring (heuristic ranking system).
      // Per matched skill: 10 (breadth — "you have it") + level × 5 (depth — level max is 5,
      // so +0 to +25). Example: React L4 contributes 10 + 20 = 30; an unset level (L0)
      // still contributes the 10 base. Unmatched skills contribute nothing.
      let score = 0;

      // Weighted linear scoring (heuristic ranking system)

      for (const skill of skills) {
        if (skill.match) {
          score += 10; // base match deafult value
          score += (skill.level ?? 0) * 5; // experience weight kay 5 ang max na value
        }
      }

      // 3. Normalize by QUERY skill count (not matched count) so scores stay comparable
      // across queries. Guard: empty query → 0 for everyone (avoids division by zero).
      // Quirk to know: the same candidate scores lower under longer queries — e.g. one L2
      // match scores 20 ÷ 1 = 20 for a 1-skill query but 20 ÷ 3 ≈ 6.67 for a 3-skill query.
      // normalize
      score = querySkills.length ? score / querySkills.length : 0;

      return {
        id: profile.userId, // Join key: the AI stage returns scores keyed by this id.
        name: profile.fullName,
        // Bio fallback chain — this string is the ONLY non-skill context the AI ever sees.
        bio: profile.aboutMe || profile.work_field || profile.current_position || "",
        profilePicture: profile.profilePicture ?? null,
        // Forward matched skills only (when a query exists) so the AI judges relevant
        // skills. Trade-off: adjacent-but-unmatched skills (e.g. knows Vue, searched
        // React) are hidden from the AI.
        skills: querySkills.length ? skills.filter((s: any) => s.match) : skills,
        // Hard cap at 100. Unreachable in practice: one skill maxes at 35 (10 + 5×5),
        // so the cap never binds — the heuristic score is purely ordinal.
        score: Math.min(score, 100),
      };
    })
    .sort((a, b) => b.score - a.score); // IMPORTANT: ranking here — descending, best candidate first.
}
