import { genAI } from ".";

// Single fast model attempt: analytics must never hold the dashboard hostage.
const ANALYTICS_MODEL = "gemini-3.5-flash-lite";
const ANALYTICS_TIMEOUT_MS = 25_000;

const LOCAL_PALETTE = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6", "#06B6D4"];

function toAbbreviation(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean);
  const code =
    words.length > 1
      ? words
          .slice(0, 3)
          .map((w) => w[0])
          .join("")
      : name.replace(/[^A-Za-z0-9]/g, "").slice(0, 3);
  return (code || "SK").toUpperCase();
}

// Deterministic fallback built from REAL counts — no AI, no invented numbers.
export function buildLocalSkillAnalytics(
  skillsData: Array<{ name: string; count: number; fields: string[] }>
): SkillAnalyticsResult {
  if (!skillsData || skillsData.length === 0) {
    return {
      pieChart: [],
      topSkills: [],
      recommendation:
        "No alumni hard skills recorded yet. Insights will appear once alumni add skills to their profiles.",
    };
  }

  const total = skillsData.reduce((sum, s) => sum + s.count, 0) || 1;
  const ranked = [...skillsData].sort((a, b) => b.count - a.count);
  const pct = (count: number) => Math.round((count / total) * 100);

  return {
    pieChart: ranked.slice(0, 5).map((s, i) => ({
      name: s.name,
      value: pct(s.count),
      color: LOCAL_PALETTE[i % LOCAL_PALETTE.length],
    })),
    topSkills: ranked.slice(0, 3).map((s, i) => ({
      field: s.fields[0] ?? "General",
      skill: s.name,
      percentage: pct(s.count),
      abbreviation: toAbbreviation(s.name),
      bgColor: LOCAL_PALETTE[i % LOCAL_PALETTE.length],
    })),
    recommendation:
      "Showing live skill counts from alumni profiles. Refresh for AI-generated trend insights.",
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export type SkillAnalyticsResult = {
  pieChart: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topSkills: Array<{
    field: string;
    skill: string;
    percentage: number;
    abbreviation: string;
    bgColor: string;
  }>;
  recommendation: string;
  lastUpdated?: string;
};

export async function generateSkillAnalytics(
  skillsData: Array<{ name: string; count: number; fields: string[] }>
): Promise<SkillAnalyticsResult> {
  // Throws on timeout/AI failure — the caller serves buildLocalSkillAnalytics instead.
  const prompt = `
You are an IT Skill Trend & Career Insights AI Engine for an Alumni Platform.

Input Data (Top Skills used by Alumni and their Work Fields):
${JSON.stringify(skillsData, null, 2)}

Task:
1. Identify the top 5 most prominent skills. Calculate their percentage distribution relative to total skills.
2. Determine which IT Field each skill is mostly used in (e.g. "Fullstack Web Development", "Backend Web Development", "Frontend Web Development", "Cloud & DevOps", "Cybersecurity & Networking", "Mobile App Development", "Data Science & AI", "UI/UX Design", "System Administration", etc.).
3. Choose vivid, rich, bold, solid, high-contrast tech brand hex colors for pie chart cells (e.g., #2563EB, #F59E0B, #10B981, #EC4899, #8B5CF6, #06B6D4, #EF4444). DO NOT use light, pastel, faded, or thin muted colors — pick strong, solid, vibrant colors that pop on both light and dark UI themes.
4. Select 2-3 top highlight skills with:
   - "field": the IT Field name
   - "skill": skill name
   - "percentage": percentage value
   - "abbreviation": 2-3 letter uppercase code (e.g., TS for TypeScript, PY for Python, CS for Cisco)
   - "bgColor": Hex color code for badge background
5. Generate a high-value, concise 1-2 sentence recommendation for graduating IT students based on these trends.

Output Rules:
- Return ONLY valid raw JSON with NO markdown formatting, NO backticks (do not wrap in \`\`\`json).
- The JSON MUST match this exact schema:
{
  "pieChart": [
    { "name": "SkillName", "value": number, "color": "#hex" }
  ],
  "topSkills": [
    {
      "field": "IT Field Name",
      "skill": "SkillName",
      "percentage": number,
      "abbreviation": "ShortCode",
      "bgColor": "#hex"
    }
  ],
  "recommendation": "Recommendation text..."
}
`;

  console.log(`Generating skill analytics with Gemini model: ${ANALYTICS_MODEL}`);

  const text = await withTimeout(
    (async () => {
      const result = await genAI.models.generateContent({
        model: ANALYTICS_MODEL,
        contents: prompt,
      });
      return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    })(),
    ANALYTICS_TIMEOUT_MS,
    "Skill analytics AI timed out"
  );

  // Clean up markdown code blocks if Gemini returns them despite prompt rules
  const cleanedJson = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();

  const parsed = JSON.parse(cleanedJson) as SkillAnalyticsResult;

  if (!parsed?.pieChart || !parsed?.topSkills || !parsed?.recommendation) {
    throw new Error("Skill analytics AI returned an unexpected shape");
  }

  return parsed;
}
