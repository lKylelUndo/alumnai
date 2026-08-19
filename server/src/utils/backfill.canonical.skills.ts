import { prisma } from "@/lib/prisma";
import { normalizeSkillName } from "@/utils/normalize.skill";

/**
 * One-time backfill script:
 * 1. Reads all existing Skill rows
 * 2. Groups them by normalized name
 * 3. Creates CanonicalSkill entries (or finds existing ones)
 * 4. Links each Skill to its CanonicalSkill
 * 5. Updates Skill.name to the canonical form
 */
export async function backfillCanonicalSkills() {
  const allSkills = await prisma.skill.findMany();
  console.log(`[Backfill] Found ${allSkills.length} existing skills`);

  // Group by normalized name → pick the most common spelling as canonical
  const groups = new Map<string, { names: Map<string, number>; ids: string[] }>();

  for (const skill of allSkills) {
    const normalized = normalizeSkillName(skill.name);
    if (!normalized) continue;

    if (!groups.has(normalized)) {
      groups.set(normalized, { names: new Map(), ids: [] });
    }

    const group = groups.get(normalized)!;
    const trimmedName = skill.name.trim();
    group.names.set(trimmedName, (group.names.get(trimmedName) || 0) + 1);
    group.ids.push(skill.id);
  }

  let linked = 0;
  let created = 0;

  for (const [normalized, group] of groups) {
    // Check if a canonical skill already exists (e.g. from seeding)
    let canonical = await prisma.canonicalSkill.findUnique({
      where: { normalizedName: normalized },
    });

    if (!canonical) {
      // Pick the most-used spelling as the canonical display name
      const bestName = [...group.names.entries()].sort((a, b) => b[1] - a[1])[0][0];

      canonical = await prisma.canonicalSkill.create({
        data: { name: bestName, normalizedName: normalized },
      });
      created++;
    }

    // Link all skills in this group to the canonical + update their display name
    for (const skillId of group.ids) {
      await prisma.skill.update({
        where: { id: skillId },
        data: {
          name: canonical.name,
          canonicalSkillId: canonical.id,
        },
      });
      linked++;
    }
  }

  console.log(`[Backfill] Created ${created} canonical skills, linked ${linked} skills`);
  return { created, linked };
}

// Allow running directly: npx tsx src/utils/backfill.canonical.skills.ts
if (require.main === module) {
  backfillCanonicalSkills()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Backfill failed:", error);
      process.exit(1);
    });
}
