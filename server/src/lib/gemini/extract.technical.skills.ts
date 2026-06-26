import { AVAILABLE_GEMINI_MODELS, genAI } from ".";

export async function extractTechnicalSkills(rawSearch: string) {
  const wordCount = rawSearch.trim().split(/\s+/).length;

  console.log("ww", wordCount);

  // Skip AI for simple searches
  if (wordCount <= 3) {
    return [rawSearch.trim()];
  }

  const input = `
You are a skill extraction engine.

Task:
Extract ONLY technical skills, programming languages, frameworks, databases, cloud platforms, tools, and technologies from the user's search query.

Rules:
- Return ONLY a valid JSON array.
- Do not include explanations.
- Do not include markdown.
- Do not include non-technical words.
- Remove duplicates.
- Preserve official technology names.

User Query:
"${rawSearch}"
`;

  let lastError: any;

  for (const model of AVAILABLE_GEMINI_MODELS) {
    try {
      console.log(`Trying model: ${model}`);

      const result = await genAI.models.generateContent({
        model,
        contents: input,
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

      console.log("Gemini raw output:", text);

      return JSON.parse(text) as string[];
    } catch (error) {
      console.warn(`Model failed: ${model}`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All models failed:", lastError);
  return [];
}
