/**
 * Normalize a skill name for deduplication lookups.
 *
 * Strips whitespace, dots, hyphens, and converts to lowercase so that
 * variants like "Next.js", "Nextjs", "next js", "NEXTJS" all map to "nextjs".
 */
export function normalizeSkillName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[.\-\s]+/g, "");
}
