import { AVAILABLE_GEMINI_MODELS, genAI } from ".";
import { RecommendedStudentTypes } from "@/types/student";

/**
 * recommendStudent — Step 6 of the smart-search pipeline.
 *
 * Role: author of `contextScore` (1.0–5.0) + `reason` ONLY. It must NOT return
 * a final score — the final number is computed deterministically in code by
 * computeFinalScore (50/50 average of heuristic base and context as percentages).
 *
 * Reads per candidate: matched skill names/levels/descriptions + one bio line.
 * Judges: depth of practical context (production work, projects, tooling) vs the query.
 * Returns: [{ id, contextScore, reason }]. Empty input → [] (no wasted call).
 */
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
3. Context score ONLY (1.0 to 5.0):
   - Review each candidate's skill 'description', project background, and 'bio' against the User Query.
   - Evaluate the depth of practical context (e.g., production experience, relevant projects, specific tooling, architectural work).
   - Assign a Context Relevance score between 1.0 and 5.0 (can use decimals like 1.2, 2.5, 3.8, up to 5.0):
      * 1.0 - 2.0: Basic or superficial mention with minimal practical context.
      * 2.1 - 3.5: Moderate relevance with demonstrated project usage or coursework.
      * 3.6 - 5.0: High relevance with deep practical, hands-on, or specialized contextual alignment with the query.
   - Do NOT compute a final score — return contextScore and reason only. The final score is computed deterministically in code (see computeFinalScore).

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

