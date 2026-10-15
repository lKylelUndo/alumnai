import { AVAILABLE_GEMINI_MODELS, genAI } from ".";
import { redis } from "@/lib/redis";
import { normalizeSkillName } from "@/utils/normalize.skill";

export type SkillInputVerdict = {
  isTechnology: boolean;
  isAbusive: boolean;
  reason: string;
};

const CACHE_PREFIX = "skill-guard:v2:";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Outage fallback — fails OPEN (allows the save). Layer 1 (local blocklist)
 * remains the hard floor; this is a deliberate hot-take decision.
 */
const FAIL_OPEN_VERDICT: SkillInputVerdict = {
  isTechnology: true,
  isAbusive: false,
  reason: "VERDICT_UNAVAILABLE_FAIL_OPEN",
};

function buildPrompt(name: string, description?: string): string {
  return `
You are an input validator for skill names on AlumnAI, a professional alumni networking platform.

TASK:
1. Decide whether the submitted skill is a legitimate skill, tool, technology, or technical method.
2. Decide whether the submitted name or description contains profanity, slurs, or abusive language.

"Technology" is limited to software, creative, and business systems:
- Software: programming languages, frameworks, libraries, databases, cloud, DevOps, data analysis, data science, AI/ML, cybersecurity, networking, mobile and web development.
- Creative / design tools and methods (e.g. "Figma", "Photoshop", "After Effects", "Blender", "UI design").
- Business systems and methods (e.g. "SAP", "Salesforce", "QuickBooks", "Kanban", "Excel modeling").

NOT valid, even when technical: medical / clinical terms (e.g. "suture technique", "MRI scanning"), industrial / manufacturing machinery (e.g. "CNC milling"), agricultural, construction, or culinary techniques — they are outside this platform's scope. Also not valid: everyday activities, hobbies, sports, biological functions, or meaningless text (e.g. "basketball", "sleeping", "asdf", "lol").

Submitted skill name: ${JSON.stringify(name)}
Submitted description: ${description ? JSON.stringify(description) : "(none)"}

Respond with ONLY valid JSON. No markdown, no code fences, no explanations:
{
  "isTechnology": true or false,
  "isAbusive": true or false,
  "reason": "one short sentence explaining the verdict"
}
`.trim();
}

/** Parse model output defensively: strip code fences, tolerate surrounding prose. */
function parseVerdict(rawText: string): SkillInputVerdict | null {
  const cleanJson = rawText.replace(/```json\n?|```/g, "").trim();

  const candidates = [cleanJson];
  const objectMatch = cleanJson.match(/\{[\s\S]*\}/);
  if (objectMatch) candidates.push(objectMatch[0]);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (
        typeof parsed?.isTechnology === "boolean" &&
        typeof parsed?.isAbusive === "boolean"
      ) {
        return {
          isTechnology: parsed.isTechnology,
          isAbusive: parsed.isAbusive,
          reason: typeof parsed.reason === "string" ? parsed.reason : "",
        };
      }
    } catch {
      // Not valid JSON — try the next candidate shape.
    }
  }

  return null;
}

/**
 * Layer 2 — Gemini semantic judge for skill input (name + optional description
 * in a single call).
 *
 * Never throws: when every model fails it logs a warning and fails OPEN
 * (allows the save), because Layer 1 remains the hard floor.
 *
 * Verdicts are cached in Redis for 24h keyed by the normalized skill name
 * (per guard spec). Cache read/write failures are swallowed and simply skip
 * the cache — they must never break the flow.
 */
export async function validateSkillInput(
  name: string,
  description?: string
): Promise<SkillInputVerdict> {
  const cacheKey = `${CACHE_PREFIX}${normalizeSkillName(name)}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Defensive: only trust a well-formed cached verdict.
      if (
        typeof parsed?.isTechnology === "boolean" &&
        typeof parsed?.isAbusive === "boolean"
      ) {
        return {
          isTechnology: parsed.isTechnology,
          isAbusive: parsed.isAbusive,
          reason: typeof parsed.reason === "string" ? parsed.reason : "",
        };
      }
    }
  } catch (error) {
    console.warn("[validateSkillInput] cache read failed, proceeding uncached:", error);
  }

  const prompt = buildPrompt(name, description);
  let verdict: SkillInputVerdict | null = null;
  let lastError: unknown;

  for (const model of AVAILABLE_GEMINI_MODELS) {
    try {
      console.log(`Trying model: ${model}`);

      const result = await genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      verdict = parseVerdict(rawText);

      if (verdict) break;

      lastError = new Error("Unparseable verdict JSON");
      console.warn(`Model returned unparseable verdict: ${model}`);
    } catch (error) {
      console.warn(`Model failed: ${model}`, error);
      lastError = error;
      continue;
    }
  }

  if (!verdict) {
    console.warn(
      "[validateSkillInput] All Gemini models failed — failing open (save allowed):",
      lastError
    );
    return FAIL_OPEN_VERDICT;
  }

  try {
    await redis.set(cacheKey, JSON.stringify(verdict), "PX", CACHE_TTL_MS);
  } catch (error) {
    console.warn("[validateSkillInput] cache write failed, verdict not cached:", error);
  }

  return verdict;
}
