/**
 * Layer 1 — deterministic, local language blocklist used by the skill input
 * guard. No AI involved, so it stays a hard floor even when Gemini is
 * unreachable.
 *
 * How to extend:
 *   - Add lowercase entries to BLOCKED_TERMS below.
 *   - Terms are matched case-insensitively on word boundaries (`\b...\b`).
 *   - Escape any regex-special characters in a term (e.g. "a\\+\\+").
 *   - Keep entries to clear-cut profanity / slurs / blasphemy; ambiguous
 *     words cause false positives on legitimate skill names and descriptions.
 */
const BLOCKED_TERMS = [
  // Profanity
  "fuck", "fucking", "fucker", "motherfucker", "shit", "bullshit",
  "bitch", "asshole", "bastard", "cunt", "dick", "pussy", "whore", "slut",
  // Blasphemy
  "goddamn", "goddammit",
  // Slurs
  "fag", "faggot", "nigger", "nigga", "retard", "spic", "chink", "kike",
  "wetback", "tranny",
];

const BLOCKLIST_REGEX = new RegExp(`\\b(${BLOCKED_TERMS.join("|")})\\b`, "i");

/** Returns true when `value` contains a blocked term. Empty/undefined is clean. */
export function containsBlockedLanguage(value?: string | null): boolean {
  if (!value) return false;
  return BLOCKLIST_REGEX.test(value);
}
