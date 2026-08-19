import { prisma } from "@/lib/prisma";
import { normalizeSkillName } from "@/utils/normalize.skill";

export class CanonicalSkillRepository {
  async findByNormalizedName(normalizedName: string) {
    return await prisma.canonicalSkill.findUnique({
      where: { normalizedName },
    });
  }

  /**
   * Core method — find an existing canonical skill or create a new one.
   *
   * @param displayName - The skill name as typed by the user (e.g. "Nextjs")
   * @returns The canonical skill record (e.g. { name: "Next.js", normalizedName: "nextjs" })
   */
  async findOrCreate(displayName: string) {
    const trimmed = displayName.trim();
    if (!trimmed) throw new Error("Skill name cannot be empty");

    const normalized = normalizeSkillName(trimmed);

    // 1. Try exact normalized match
    const existing = await prisma.canonicalSkill.findUnique({
      where: { normalizedName: normalized },
    });

    if (existing) return existing;

    // 2. No match — create a new canonical skill using the display name as-is
    return await prisma.canonicalSkill.create({
      data: {
        name: trimmed,
        normalizedName: normalized,
      },
    });
  }

  async search(query: string, limit: number = 10) {
    const trimmed = query.trim();
    if (!trimmed) return [];

    return await prisma.canonicalSkill.findMany({
      where: {
        OR: [
          { name: { contains: trimmed, mode: "insensitive" } },
          { normalizedName: { contains: normalizeSkillName(trimmed), mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
      take: limit,
    });
  }
}
