import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class MentorRepository {
  async findTopMentors() {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}top-mentors`;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to DB — get alumni ranked by accepted mentorship count
    const mentors = await prisma.user.findMany({
      where: {
        role: "ALUMNI",
        receivedMentorships: { some: { status: "ACTIVE" } },
      },
      select: {
        id: true,
        profile: {
          select: { fullName: true },
        },
        _count: {
          select: { receivedMentorships: { where: { status: "ACTIVE" } } },
        },
      },
      orderBy: {
        receivedMentorships: { _count: "desc" },
      },
      take: 10,
    });

    const ranked = mentors.map((mentor, index) => ({
      id: mentor.id,
      ranking: index + 1,
      name: mentor.profile?.fullName ?? "Unknown",
      mentees: mentor._count.receivedMentorships,
    }));

    await redis.set(cacheKey, JSON.stringify(ranked), "PX", 1000 * 60 * 5);

    return ranked;
  }
}
