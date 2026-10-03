import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class AdminRepository {
  // All cache keys this repository owns
  private static CACHE_KEYS = {
    dashboardStats: `${ENV.ADMIN_REDIS_KEY}dashboard-stats`,
    allUsers: `${ENV.ADMIN_REDIS_KEY}all-users`,
    unverifiedUsers: `${ENV.ADMIN_REDIS_KEY}unverified-users`,
    topMentors: `${ENV.ADMIN_REDIS_KEY}top-mentors`,
    topAlumniSkills: `${ENV.ADMIN_REDIS_KEY}top-alumni-skills`,
  };

  /**
   * Invalidate admin cache keys.
   * Pass specific targets to clear only those, or omit to clear all.
   * Best-effort: a dead cache must never fail the request that triggered
   * it (entries expire via TTL anyway).
   */
  async invalidateCache(targets?: ("dashboard-stats" | "all-users" | "unverified-users" | "top-mentors" | "top-alumni-skills")[]) {
    const keyMap: Record<string, string> = {
      "dashboard-stats": AdminRepository.CACHE_KEYS.dashboardStats,
      "all-users": AdminRepository.CACHE_KEYS.allUsers,
      "unverified-users": AdminRepository.CACHE_KEYS.unverifiedUsers,
      "top-mentors": AdminRepository.CACHE_KEYS.topMentors,
      "top-alumni-skills": AdminRepository.CACHE_KEYS.topAlumniSkills,
    };

    const keys = targets
      ? targets.map((t) => keyMap[t]).filter(Boolean)
      : Object.values(keyMap);

    if (keys.length > 0) {
      try {
        await redis.del(...keys);
      } catch (error) {
        console.warn("[AdminRepository] invalidateCache failed:", error);
      }
    }
  }

  async findByStudentIdNumber(studentIdNumber: string) {
    return await prisma.user.findUnique({
      where: {
        student_id_number: studentIdNumber,
      },
      select: {
        id: true,
        email: true,
        isAccountVerified: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findUnverified() {
    const cacheKey = AdminRepository.CACHE_KEYS.unverifiedUsers;

    // try cache first (never fail the request on cache errors)
    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (error) {
      console.warn("[AdminRepository] cache read failed, falling back to DB:", error);
    }
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

    try {
      await redis.set(cacheKey, JSON.stringify(users), "PX", 1000 * 60 * 5);
    } catch (error) {
      console.warn("[AdminRepository] cache write failed:", error);
    }

    return users;
  }

  async verify(id: string) {
    return await prisma.user.update({
      where: {
        student_id_number: id,
      },
      data: {
        isAccountVerified: true,
      },
    });
  }

  async findAllUsers() {
    const cacheKey = AdminRepository.CACHE_KEYS.allUsers;

    // try cache first (never fail the request on cache errors)
    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (error) {
      console.warn("[AdminRepository] cache read failed, falling back to DB:", error);
    }
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
        accountStatus: true,
        profile: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((user) => ({
      id: user.id,
      user: user.profile?.fullName ?? "Unknown",
      email: user.email ?? "",
      role: user.role === "ALUMNI" ? "Alumni" : "Student",
      status: user.accountStatus === "SUSPENDED" ? "Suspended" : (user.isAccountVerified ? "Active" : "Inactive"),
    }));

    try {
      await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);
    } catch (error) {
      console.warn("[AdminRepository] cache write failed:", error);
    }

    return formatted;
  }

  async suspend(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { accountStatus: "SUSPENDED" },
    });
  }

  async activate(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { accountStatus: "ACTIVE" },
    });
  }

  async reject(id: string) {
    await prisma.user.delete({
      where: { student_id_number: id }
    });

    await this.invalidateCache(["unverified-users", "dashboard-stats"]);

    // Re-fetch and re-cache
    return await this.findUnverified();
  }

  async getDashboardStats() {
    const cacheKey = AdminRepository.CACHE_KEYS.dashboardStats;

    // try cache first (never fail the request on cache errors)
    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (error) {
      console.warn("[AdminRepository] cache read failed, falling back to DB:", error);
    }
    if (cached) return JSON.parse(cached);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      newStudentsThisMonth,
      verifiedAlumni,
      newAlumniThisMonth,
      activeMentorships,
      newMentorshipsThisMonth,
      activeCollaborations,
      newCollaborationsThisMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { role: "ALUMNI", isAccountVerified: true } }),
      prisma.user.count({ where: { role: "ALUMNI", isAccountVerified: true, createdAt: { gte: startOfMonth } } }),
      prisma.mentorship.count({ where: { status: "ACTIVE" } }),
      prisma.mentorship.count({ where: { status: "ACTIVE", createdAt: { gte: startOfMonth } } }),
      prisma.collaboration.count({ where: { status: "ACTIVE" } }),
      prisma.collaboration.count({ where: { status: "ACTIVE", createdAt: { gte: startOfMonth } } }),
    ]);

    const stats = {
      totalStudents,
      newStudentsThisMonth,
      verifiedAlumni,
      newAlumniThisMonth,
      activeMentorships,
      newMentorshipsThisMonth,
      activeCollaborations,
      newCollaborationsThisMonth,
    };

    try {
      await redis.set(cacheKey, JSON.stringify(stats), "PX", 1000 * 60 * 5);
    } catch (error) {
      console.warn("[AdminRepository] cache write failed:", error);
    }

    return stats;
  }
}
