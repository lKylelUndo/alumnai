/**
 * Final score for intelligent search — "average of two percentages".
 *
 * Converts the heuristic base (0–35 scale) and the AI context score (1–5 scale)
 * to percentages of their own maxima, then averages them 50/50:
 *
 *   skillPct   = (heuristicScore ÷ 35) × 100   // 35 = max base (10 + 5 × level 5)
 *   contextPct = (contextScore ÷ 5) × 100      // 5 = top of the AI relevance band
 *   Final      = round((skillPct + contextPct) ÷ 2)
 *
 * Worked example — base 32.5, context 4.2:
 *   skillPct = 32.5 ÷ 35 × 100 = 92.9; contextPct = 4.2 ÷ 5 × 100 = 84
 *   Final = round((92.9 + 84) ÷ 2) = 88
 *
 * Same inputs always produce the same number. The AI authors contextScore +
 * reason only; this function owns the arithmetic.
 */
export const MAX_HEURISTIC_SCORE = 35;
export const MAX_CONTEXT_SCORE = 5;
const FALLBACK_CONTEXT_SCORE = 3;

export function computeFinalScore(
  heuristicScore: number,
  contextScore: unknown
): { score: number; contextScore: number } {
  const raw =
    typeof contextScore === "number" && Number.isFinite(contextScore)
      ? contextScore
      : FALLBACK_CONTEXT_SCORE;
  const clamped = Math.min(Math.max(raw, 1), MAX_CONTEXT_SCORE);

  const skillPct = Math.min(heuristicScore / MAX_HEURISTIC_SCORE, 1) * 100;
  const contextPct = (clamped / MAX_CONTEXT_SCORE) * 100;

  return { score: Math.round((skillPct + contextPct) / 2), contextScore: clamped };
}
