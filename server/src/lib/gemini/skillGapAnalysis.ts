import { AVAILABLE_GEMINI_MODELS, genAI } from ".";

export type SkillGapItem = {
  name: string;
  alumniCount: number;
  recommendation: string;
};

export type SkillGapAnalysisResult = {
  overview: string;
  missingSkills: SkillGapItem[];
  matchingSkills: Array<{ name: string; alumniCount: number }>;
  workField: string;
};

export async function generateSkillGapAnalysis(
  studentSkills: string[],
  alumniSkills: Array<{ name: string; count: number }>,
  workField: string
): Promise<SkillGapAnalysisResult> {
  const studentSkillSet = new Set(studentSkills.map((s) => s.toLowerCase().trim()));

  const missingFromStudent = alumniSkills.filter(
    (item) => !studentSkillSet.has(item.name.toLowerCase().trim())
  );

  const matchingWithStudent = alumniSkills.filter((item) =>
    studentSkillSet.has(item.name.toLowerCase().trim())
  );

  const fallbackResult: SkillGapAnalysisResult = {
    overview: `Based on alumni in ${workField || "your field"}, learning key technical tools and industry frameworks will significantly improve your career competitiveness.`,
    missingSkills: missingFromStudent.slice(0, 5).map((s) => ({
      name: s.name,
      alumniCount: s.count,
      recommendation: `${s.count} of alumni in ${workField || "your field"} use ${s.name}. Consider learning ${s.name} to increase your competitiveness.`,
    })),
    matchingSkills: matchingWithStudent.map((s) => ({
      name: s.name,
      alumniCount: s.count,
    })),
    workField: workField || "General IT",
  };

  if (!alumniSkills || alumniSkills.length === 0) {
    return {
      overview: `No alumni data available for ${workField || "your field"} yet. Keep expanding your core skill set!`,
      missingSkills: [],
      matchingSkills: [],
      workField: workField || "General IT",
    };
  }

  const prompt = `
You are an expert career coach and IT skills advisor for an alumni networking platform.

Student's Chosen Work/Field: "${workField || "Web Development"}"
Student's Current Skills: ${JSON.stringify(studentSkills)}
Top Alumni Skills in "${workField || "Web Development"}" (with count of alumni using each skill):
${JSON.stringify(alumniSkills, null, 2)}

Task:
1. Compare student's current skills against alumni skills in their field.
2. Identify missing skills (skills alumni possess that the student does not have).
3. For each missing skill, generate a concise, actionable, single-sentence recommendation formatted like:
   "{count} of alumni in {workField} use {skillName}. Consider learning {skillName} to increase your competitiveness."
4. Provide a brief 1-2 sentence overall career advice overview (AI Overview) summarizing what key gaps the student should focus on.

Output Rules:
- Return ONLY valid raw JSON with NO markdown formatting, NO backticks (do not wrap in \`\`\`json).
- The JSON MUST match this exact structure:
{
  "overview": "AI overview text here...",
  "missingSkills": [
    {
      "name": "SkillName",
      "alumniCount": number,
      "recommendation": "Recommendation text..."
    }
  ],
  "matchingSkills": [
    {
      "name": "SkillName",
      "alumniCount": number
    }
  ],
  "workField": "${workField || "Web Development"}"
}
`;

  for (const model of AVAILABLE_GEMINI_MODELS) {
    try {
      console.log(`Generating Skill Gap Analysis with Gemini model: ${model}`);

      const result = await genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
      const cleanedJson = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanedJson) as SkillGapAnalysisResult;

      if (parsed?.overview && Array.isArray(parsed?.missingSkills)) {
        return parsed;
      }
    } catch (error) {
      console.warn(`Skill Gap Analysis model failed: ${model}`, error);
      continue;
    }
  }

  console.error("All Gemini models failed for Skill Gap Analysis, using calculated fallback.");
  return fallbackResult;
}
