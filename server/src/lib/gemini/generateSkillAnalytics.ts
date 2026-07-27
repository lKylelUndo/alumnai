import { AVAILABLE_GEMINI_MODELS, genAI } from ".";

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
};

export async function generateSkillAnalytics(
  skillsData: Array<{ name: string; count: number; fields: string[] }>
): Promise<SkillAnalyticsResult> {
  const fallbackResult: SkillAnalyticsResult = {
    pieChart: [
      { name: "TypeScript", value: 40, color: "#1E64D4" },
      { name: "JavaScript", value: 20, color: "#EAB308" },
      { name: "React", value: 20, color: "#0047CB" },
      { name: "PHP", value: 10, color: "#0EA5E9" },
      { name: "C#", value: 10, color: "#EF4444" },
    ],
    topSkills: [
      {
        field: "Fullstack Web Development",
        skill: "TypeScript",
        percentage: 40,
        abbreviation: "TS",
        bgColor: "#007ACC",
      },
      {
        field: "Backend Web Development",
        skill: "PHP",
        percentage: 10,
        abbreviation: "PHP",
        bgColor: "#777BB4",
      },
    ],
    recommendation:
      "TypeScript continues to lead industry adoption. Consider adding advanced Fullstack TypeScript workshops for graduating students.",
  };

  if (!skillsData || skillsData.length === 0) {
    return fallbackResult;
  }

  const prompt = `
You are an IT Skill Trend & Career Insights AI Engine for an Alumni Platform.

Input Data (Top Skills used by Alumni and their Work Fields):
${JSON.stringify(skillsData, null, 2)}

Task:
1. Identify the top 5 most prominent skills. Calculate their percentage distribution relative to total skills.
2. Determine which IT Field each skill is mostly used in (e.g. "Fullstack Web Development", "Backend Web Development", "Frontend Web Development", "Cloud & DevOps", "Cybersecurity & Networking", "Mobile App Development", "Data Science & AI", "UI/UX Design", "System Administration", etc.).
3. Choose aesthetic UI brand colors for pie chart cells (hex codes).
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

  for (const model of AVAILABLE_GEMINI_MODELS) {
    try {
      console.log(`Generating skill analytics with Gemini model: ${model}`);

      const result = await genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

      // Clean up markdown code blocks if Gemini returns them despite prompt rules
      const cleanedJson = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();

      const parsed = JSON.parse(cleanedJson) as SkillAnalyticsResult;

      if (parsed?.pieChart && parsed?.topSkills && parsed?.recommendation) {
        return parsed;
      }
    } catch (error) {
      console.warn(`Skill Analytics model failed: ${model}`, error);
      continue;
    }
  }

  console.error("All Gemini models failed for Skill Analytics, using fallback.");
  return fallbackResult;
}
