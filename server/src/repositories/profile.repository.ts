import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { UpdateProfileInputTypes } from "@/schema/profile";

export class ProfileRepository {
  async all() {
    const cacheKey = "all-profiles";

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to db
    const profiles = await prisma.profile.findMany();

    await redis.set(cacheKey, JSON.stringify(profiles), "PX", 1000 * 60 * 5);

    return profiles;
  }

  async findById(userId: string) {
    return await prisma.profile.findUnique({
      where: { userId },
    });
  }

  async update(data: UpdateProfileInputTypes) {
    const { userId, ...restData } = data;
    return await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...restData,
      },
    });
  }

  async matchSkill(skills: string[]) {
    return await prisma.profile.findMany({
      where: {
        skills: {
          some: {
            name: {
              in: skills,
            },
          },
        },
      },
      include: {
        skills: true,
        user: true,
      },
    });
  }
}
