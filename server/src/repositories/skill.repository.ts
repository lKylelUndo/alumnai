import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { generateSkillAnalytics, buildLocalSkillAnalytics } from "@/lib/gemini";
import { AddSkillInputTypes } from "@/schema/skill";
import { RoleType, SkillType } from "@/generated/prisma/enums";

export class SkillRepository {
  async add(data: AddSkillInputTypes) {
    return await prisma.skill.create({
      data: data as any,
    });
  }

  async remove(id: string) {
    return await prisma.skill.delete({
      where: { id }
    })
  }

  async findAlumniSkillsByWorkField(workField?: string | null) {
    const alumniSkills = await prisma.skill.findMany({
      where: {
        type: { in: [SkillType.HARD_SKILL, SkillType.OTHER_HARD_SKILL] },
        profile: {
          user: {
            role: RoleType.ALUMNI,
          },
          ...(workField
            ? {
                OR: [
                  { work_field: { contains: workField, mode: "insensitive" } },
                  { current_position: { contains: workField, mode: "insensitive" } },
                ],
              }
            : {}),
        },
      },
      select: {
        name: true,
      },
    });

    let skillsToProcess = alumniSkills;
    if (skillsToProcess.length === 0 && workField) {
      skillsToProcess = await prisma.skill.findMany({
        where: {
          type: { in: [SkillType.HARD_SKILL, SkillType.OTHER_HARD_SKILL] },
          profile: {
            user: {
              role: RoleType.ALUMNI,
            },
          },
        },
        select: {
          name: true,
        },
      });
    }

    const skillCountsMap = new Map<string, number>();
    for (const skill of skillsToProcess) {
      const name = skill.name.trim();
      if (!name) continue;
      skillCountsMap.set(name, (skillCountsMap.get(name) || 0) + 1);
    }

    return Array.from(skillCountsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async findTopAlumniSkills(forceRefresh: boolean = false) {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}top-alumni-skills:v2`;

    // try cache first unless force refresh requested
    if (!forceRefresh) {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // fallback to DB — fetch hard skills from alumni profiles with work fields
    const skills = await prisma.skill.findMany({
      where: {
        type: { in: [SkillType.HARD_SKILL, SkillType.OTHER_HARD_SKILL] },
        profile: {
          user: {
            role: RoleType.ALUMNI,
          },
        },
      },
      include: {
        profile: {
          select: {
            work_field: true,
            current_position: true,
          },
        },
      },
    });

    const skillMap = new Map<string, { count: number; fields: Set<string> }>();

    for (const skill of skills) {
      const name = skill.name.trim();
      if (!name) continue;

      const existing = skillMap.get(name) || { count: 0, fields: new Set<string>() };
      existing.count += 1;
      if (skill.profile?.work_field) existing.fields.add(skill.profile.work_field);
      if (skill.profile?.current_position) existing.fields.add(skill.profile.current_position);
      skillMap.set(name, existing);
    }

    const skillsData = Array.from(skillMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        fields: Array.from(data.fields),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // AI first (single fast attempt, ~25s cap inside); live local counts on failure.
    // Local results cache briefly so the next visit is instant and retries AI sooner.
    const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;
    const ONE_HOUR_IN_MS = 1000 * 60 * 60;

    let analytics;
    let cacheTtl = SEVEN_DAYS_IN_MS;
    if (skillsData.length === 0) {
      analytics = buildLocalSkillAnalytics(skillsData);
      cacheTtl = ONE_HOUR_IN_MS;
    } else {
      try {
        analytics = await generateSkillAnalytics(skillsData);
      } catch (error) {
        console.warn("Skill analytics AI unavailable, serving live counts:", error);
        analytics = buildLocalSkillAnalytics(skillsData);
        cacheTtl = ONE_HOUR_IN_MS;
      }
    }

    const analyticsWithTimestamp = {
      ...analytics,
      lastUpdated: new Date().toISOString(),
    };

    await redis.set(cacheKey, JSON.stringify(analyticsWithTimestamp), "PX", cacheTtl);

    return analyticsWithTimestamp;
  }

  async findStudentProfileWithSkills(userId: string) {
    return await prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: true,
      },
    });
  }

  async getCachedSkillGap(userId: string) {
    const cacheKey = `${ENV.STUDENT_REDIS_KEY}${userId}:skill-gap-analysis`;
    const cached = await redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }

  async setCachedSkillGap(userId: string, data: any) {
    const cacheKey = `${ENV.STUDENT_REDIS_KEY}${userId}:skill-gap-analysis`;
    const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;
    await redis.set(cacheKey, JSON.stringify(data), "PX", SEVEN_DAYS_IN_MS);
  }

  async invalidateSkillGapCache(userId: string) {
    const cacheKey = `${ENV.STUDENT_REDIS_KEY}${userId}:skill-gap-analysis`;
    await redis.del(cacheKey);
  }
}


