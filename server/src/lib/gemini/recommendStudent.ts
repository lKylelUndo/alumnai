import { AVAILABLE_GEMINI_MODELS, genAI } from ".";
import { RecommendedStudentTypes } from "@/types/student";

export async function recommendStudent(rawSearch: string,extractedSkills: string[],data: RecommendedStudentTypes[] ) {
  if (data.length === 0) return [];

  const prompt = `
You are an AI recruitment assistant for AlumnAI.

IMPORTANT RULES:
- Use ONLY the candidates provided below.
- Do NOT invent students.
- Do NOT invent skills.
- Do NOT change candidate IDs.
- Rank ONLY the provided candidates.
- Prefer candidates whose skill descriptions closely match the user's intent.
- Consider skill level when two candidates have similar experience.
- Return ONLY valid JSON.
- Do NOT wrap the JSON in markdown.

User Query:
${rawSearch}

Extracted Skills:
${JSON.stringify(extractedSkills)}

Candidates:
${JSON.stringify(data)}

Return this exact JSON format:

[
  {
    "id": "candidate-id",
    "score": 95,
    "reason": "Explain briefly why this candidate ranks highly."
  }
]
`;

  let lastError: unknown;

  for (const model of AVAILABLE_GEMINI_MODELS) {
    try {
      const result = await genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

      return JSON.parse(text);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
