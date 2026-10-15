import { pathToFileURL } from "node:url";
import { prisma } from "@/lib/prisma";
import { containsBlockedLanguage } from "@/utils/profanity.blocklist";

/**
 * Read-only scrub report for suspect canonical skill rows.
 *
 * Deterministic heuristics only (no AI):
 *   - name shorter than 2 characters after trim
 *   - no letters at all (pure numbers, symbols, emoji)
 *   - language blocklist hit
 *   - obvious gibberish: vowel-less strings of 6+ characters
 *
 * Prints id / name / usageCount for human review. This script NEVER deletes
 * anything — deletions are approved and performed separately by a human.
 *
 * Run: npx tsx src/utils/report.suspect.skills.ts
 */

function isSuspectSkillName(name: string): boolean {
  const trimmed = name.trim();

  // Too short to be a real skill name.
  if (trimmed.length < 2) return true;

  // No letters at all (pure numeric, symbols-only, emoji-only).
  if (!/\p{L}/u.test(trimmed)) return true;

  // Local language blocklist.
  if (containsBlockedLanguage(trimmed)) return true;

  // Obvious gibberish: 6+ characters with no vowels (e.g. "asdfgh").
  if (trimmed.length >= 6 && !/[aeiou]/i.test(trimmed)) return true;

  return false;
}

export async function reportSuspectSkills() {
  const canonicalSkills = await prisma.canonicalSkill.findMany({
    include: { _count: { select: { skills: true } } },
    orderBy: { name: "asc" },
  });

  const suspects = canonicalSkills
    .filter((skill) => isSuspectSkillName(skill.name))
    .map((skill) => ({
      id: skill.id,
      name: skill.name,
      usageCount: skill._count.skills,
    }));

  console.log(
    `[SuspectSkills] Scanned ${canonicalSkills.length} canonical skills — ${suspects.length} suspect. No rows were modified.`
  );

  if (suspects.length === 0) {
    console.log("[SuspectSkills] Nothing to review.");
    return suspects;
  }

  console.table(suspects);
  return suspects;
}

// Allow running directly: npx tsx src/utils/report.suspect.skills.ts
// (ESM-safe check — `require.main` is not available in this module type.)
const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  reportSuspectSkills()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Suspect skill report failed:", error);
      process.exit(1);
    });
}
