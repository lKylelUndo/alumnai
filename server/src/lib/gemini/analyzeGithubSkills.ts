import { AVAILABLE_GEMINI_MODELS, genAI } from "@/lib/gemini";
import type { CondensedGitHubProfile } from "@/lib/github";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GithubSkillIndexResult {
  hardSkills: string[];
  softSkills: string[];
  domainFocus: string[];
  summary: string;
}

// ─── Gemini Analysis ─────────────────────────────────────────────────────────

/**
 * Send condensed GitHub profile data to Gemini for structured skill extraction.
 */
export async function analyzeGithubSkills(
  profileData: CondensedGitHubProfile
): Promise<GithubSkillIndexResult> {
  const prompt = `
You are an AI skill analysis engine for a university alumni tracking platform called AlumnAi.

Task:
Analyze the following condensed GitHub profile data and extract a structured skill profile.

GitHub Profile Summary:
${JSON.stringify(profileData, null, 2)}

Rules:
- Return ONLY a valid JSON object (no markdown, no explanation, no code fences).
- Use the exact schema below.
- "hardSkills" should list specific technologies, frameworks, languages, libraries, and tools the user demonstrably uses.
- "softSkills" should infer broader competencies from project types (e.g., "Problem Solving", "API Design", "Database Management").
- "domainFocus" should identify primary areas of expertise (e.g., "Full-Stack Web Development", "Backend Systems").
- "summary" should be a 1-2 sentence professional summary of the user's technical profile.
- Remove duplicates and normalize names (e.g., "react" → "React", "next" → "Next.js", "tailwindcss" → "Tailwind CSS").
- Do NOT fabricate skills not evidenced by the data.

Required JSON Schema:
{
  "hardSkills": string[],
  "softSkills": string[],
  "domainFocus": string[],
  "summary": string
}
`;

  let lastError: any;

  for (const model of AVAILABLE_GEMINI_MODELS) {
    try {
      console.log(`[GithubSkillIndex] Trying Gemini model: ${model}`);

      const result = await genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

      // Strip potential markdown code fences
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      console.log("[GithubSkillIndex] Gemini raw output:", cleaned);

      return JSON.parse(cleaned) as GithubSkillIndexResult;
    } catch (error) {
      console.warn(`[GithubSkillIndex] Model failed: ${model}`, error);
      lastError = error;
      continue;
    }
  }

  console.error("[GithubSkillIndex] All Gemini models failed:", lastError);
  throw new Error("All Gemini models failed to analyse the GitHub data.");
}
