import { extractTechnicalSkills, recommendStudent } from "@/lib/gemini";
import { ProfileRepository } from "@/repositories/profile.repository";
import { CanonicalSkillRepository } from "@/repositories/canonical.skill.repository";
import { normalizeSkillName } from "@/utils/normalize.skill";
import { formatCandidates } from "@/utils/format.recommended.candidates";
import { computeFinalScore } from "@/utils/compute.final.score";

/**
 * SmartSearchService — intelligent collaborator search pipeline.
 *
 * Guide to the 7 steps below:
 *   Step 1 (extract):   turn the raw query into skill names (Gemini, skipped if ≤3 words).
 *   Step 2 (canonical):  collapse nicknames to one canonical name ("reactjs" → "React") + dedupe.
 *   Step 3 (early exit): no usable skills → return `noSkillsDetected` so the client shows
 *                         guidance instead of a silent empty list. No DB/AI cost from here on.
 *   Step 4 (match gate): Prisma finds ACTIVE students holding ≥1 query skill (OR semantics).
 *   Step 5 (heuristic):  formatCandidates scores Σ(10 + level×5) ÷ querySkills, sorts best-first.
 *   Step 6 (AI judge):   recommendStudent scores described experience 1–5 + writes a reason.
 *                         The AI authors contextScore + reason ONLY — never the final number.
 *   Step 7 (final):      computeFinalScore averages both stages as percentages (50/50),
 *                         merged back onto profile rows by id. Same inputs → same number.
 */
export const SmartSearchService = async (rawSearch: string) => {
  const profileRepository = new ProfileRepository();
  const canonicalSkillRepository = new CanonicalSkillRepository();

  try {
    // Step 1 — extract skill names from the raw query.
    // Short queries (≤3 words, e.g. "React Native") skip Gemini and are used raw.
    const rawExtractedSkills = await extractTechnicalSkills(rawSearch);

    console.log("rawExtractSkill", rawExtractedSkills);

    // Step 2 — canonicalize each extracted skill so variants collapse to one name,
    // then dedupe (e.g. ["reactjs", "React"] → ["React"]). Unmatched terms pass through raw.
    const canonicalSkillsPromises = rawExtractedSkills.map(async (rawSkill) => {
      const normalized = normalizeSkillName(rawSkill);
      if (!normalized) return rawSkill;
      const canonical = await canonicalSkillRepository.findByNormalizedName(normalized);
      return canonical ? canonical.name : rawSkill;
    });

    const extractedSkills = Array.from(new Set(await Promise.all(canonicalSkillsPromises)));
    console.log("SmartSearchService - canonical extractedSkills:", extractedSkills);

    // Step 3 — early exit. No skills detected (e.g. a name typed into the skills
    // box) — skip the DB match and the ranking call entirely so the client can
    // show guidance instead of a silent empty list. Zero DB/AI cost past this point.
    const hasSkills = extractedSkills.some(
      (s) => typeof s === "string" && s.trim().length > 0
    );
    if (!hasSkills) {
      return {
        status: "success",
        code: 200,
        recommendedStudents: [],
        noSkillsDetected: true,
      };
    }

    // Step 4 — match gate. One Prisma query: ACTIVE students holding ANY query
    // skill. Anyone with zero matches never enters the candidate pool.
    const students = await profileRepository.matchSkill(extractedSkills);
    console.log("SmartSearchService - students:", students);

    // Step 5 — heuristic rank (deterministic). Scores +10 per matched skill and
    // +level×5 per matched skill, normalized by query-skill count, sorted best-first.
    // See format.recommended.candidates.ts for the full formula + worked example.
    const formattedCandidates = formatCandidates(students, extractedSkills);
    console.log("SmartSearchService - formattedCandidates:", formattedCandidates);

    // Step 6 — AI judge. Gemini reads each candidate's skill descriptions + bio
    // against the query and returns { id, contextScore (1–5), reason }.
    // It does NOT decide the final number — that happens in Step 7.
    const recommendedStudents = await recommendStudent(rawSearch,extractedSkills,formattedCandidates);
    console.log("SmartSearchService - recommendedStudents:", recommendedStudents);

    const candidateById = new Map(
      formattedCandidates.map((candidate) => [candidate.id, candidate]),
    );

    const recommendedStudentsWithProfile = recommendedStudents.map((item: any) => {
      const base = candidateById.get(item.id);
      // Final is computed deterministically in code (50/50 average of both
      // stages as percentages); the AI authors contextScore + reason only.
      // `score` is set after the spreads so a stray model-returned score can't override it.
      const { score, contextScore } = computeFinalScore(base?.score ?? 0, item.contextScore);
      return {
        ...base,
        ...item,
        score,
        contextScore,
        skills: base?.skills ?? [],
        bio: base?.bio ?? "",
        name: base?.name ?? "",
      };
    });

    return {
      status: "success",
      code: 200,
      recommendedStudents: recommendedStudentsWithProfile,
    };
  } catch (error) {
    console.error("smartSearch", error);
    return { status: "error", code: 500, message: "Unable to search" };
  }
};
