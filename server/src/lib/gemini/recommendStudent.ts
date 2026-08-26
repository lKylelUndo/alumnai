import { AVAILABLE_GEMINI_MODELS, genAI } from ".";
import { RecommendedStudentTypes } from "@/types/student";

export async function recommendStudent(
  rawSearch: string,
  extractedSkills: string[],
  data: RecommendedStudentTypes[]
) {
  if (data.length === 0) return [];

  const prompt = `
You are an AI recruitment and candidate ranking assistant for AlumnAI.

TASK:
Evaluate and rank the provided candidates based on both their skill matches and the contextual relevance of their skill descriptions and experience.

SCORING GUIDELINES:
1. Base Match: The candidate starts with their heuristic base score from the data.
2. Context Relevance Bonus (Score: 1.0 to 5.0):
   - Review each candidate's skill 'description', project background, and 'bio' against the User Query.
   - Evaluate the depth of practical context (e.g., production experience, relevant projects, specific tooling, architectural work).
   - Assign a Context Relevance score between 1.0 and 5.0 (can use decimals like 1.2, 2.5, 3.8, up to 5.0):
     * 1.0 - 2.0: Basic or superficial mention with minimal practical context.
     * 2.1 - 3.5: Moderate relevance with demonstrated project usage or coursework.
     * 3.6 - 5.0: High relevance with deep practical, hands-on, or specialized contextual alignment with the query.
3. Final Score: Combine candidate's base qualifications with the contextual relevance bonus (capped at 100).

RULES:
- Use ONLY the candidates provided below.
- Do NOT invent candidates, skills, or modify IDs.
- Return ONLY valid JSON (no markdown formatting, no code blocks).

User Query:
${rawSearch}

Extracted Skills:
${JSON.stringify(extractedSkills)}

Candidates Data:
${JSON.stringify(data)}

Return this exact JSON structure:
[
  {
    "id": "candidate-id",
    "score": 92.5,
    "contextScore": 3.8,
    "reason": "Explain briefly how their skill context and experience specifically align with the query."
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

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
      const cleanJson = rawText.replace(/```json\n?|```/g, "").trim();

      return JSON.parse(cleanJson);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

