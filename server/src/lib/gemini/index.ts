import { ENV } from "@/config/env";
import { GoogleGenAI } from "@google/genai";

export { extractTechnicalSkills } from "@/lib/gemini/extract.technical.skills"
export { recommendStudent } from "@/lib/gemini/recommendStudent"
export { generateSkillAnalytics, buildLocalSkillAnalytics } from "@/lib/gemini/generateSkillAnalytics"
export { analyzeGithubSkills } from "@/lib/gemini/analyzeGithubSkills"
export { generateSkillGapAnalysis } from "@/lib/gemini/skillGapAnalysis"

export const AVAILABLE_GEMINI_MODELS = [
  "gemini-3.1-pro-preview",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.7-flash"
] as const;

export const EMBEDDING_MODEL = "gemini-embedding-2";
export const genAI = new GoogleGenAI({ apiKey: ENV.GEMINI_KEY });