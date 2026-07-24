import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class AdminRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: { isAccountVerified: true, id: true },
    });
  }

  async findUnverified() {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}unverified-users`;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to DB
    const users = await prisma.user.findMany({
      where: { isAccountVerified: false },
      select: {
        id: true,
        email: true,
        student_id_number: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    await redis.set(cacheKey, JSON.stringify(users), "PX", 1000 * 60 * 5);

    return users;
  }

  async verify(id: string) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        isAccountVerified: true,
      },
    });
  }

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
      ranking: index + 1,
      name: mentor.profile?.fullName ?? "Unknown",
      mentees: mentor._count.receivedMentorships,
    }));

    await redis.set(cacheKey, JSON.stringify(ranked), "PX", 1000 * 60 * 5);

    return ranked;
  }

  async findAlumniRequests() {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}alumni-requests`;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to DB
    const requests = await prisma.alumniUpgradeRequest.findMany({
      include: {
        user: {
          select: {
            student_id_number: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = requests.map((req) => ({
      id: req.id,
      studentId: req.user.student_id_number,
      name: req.user.profile?.fullName ?? "Unknown",
      email: req.user.email ?? "",
      documents: req.documentUrl,
      status: req.status.toLowerCase(),
    }));

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }

  async findAllUsers() {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}all-users`;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to DB — get all non-admin verified users
    const users = await prisma.user.findMany({
      where: {
        role: { not: "ADMIN" },
        isAccountVerified: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isAccountVerified: true,
        profile: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((user) => ({
      id: user.id,
      user: user.profile?.fullName ?? "Unknown",
      email: user.email ?? "",
      role: user.role === "ALUMNI" ? "Alumni" : "Student",
      status: user.isAccountVerified ? "Active" : "Inactive",
    }));

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }

  async findSkillAnalytics() {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}skill-analytics`;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to DB — aggregate skills by name with count
    const skills = await prisma.skill.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 10,
    });

    const formatted = skills.map((skill) => ({
      name: skill.name,
      count: skill._count.name,
    }));

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }
}
