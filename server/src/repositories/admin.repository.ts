import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { generateSkillAnalytics } from "@/lib/gemini";

export class AdminRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
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

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }

  async findSkillAnalytics(forceRefresh: boolean = false) {
    const cacheKey = `${ENV.ADMIN_REDIS_KEY}skill-analytics`;

    // try cache first unless force refresh requested
    if (!forceRefresh) {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // fallback to DB — fetch skills with profile work fields
    const skills = await prisma.skill.findMany({
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

    const analytics = await generateSkillAnalytics(skillsData);
    const analyticsWithTimestamp = {
      ...analytics,
      lastUpdated: new Date().toISOString(),
    };

    // Cache analytics in Redis for 7 days (7 * 24 * 60 * 60 * 1000 ms)
    const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;
    await redis.set(cacheKey, JSON.stringify(analyticsWithTimestamp), "PX", SEVEN_DAYS_IN_MS);

    return analyticsWithTimestamp;
  }

  async suspend(id: string) {
    const updated = await prisma.user.update({
      where: { id },
      data: { accountStatus: "SUSPENDED" },
    });
    await redis.del(`${ENV.ADMIN_REDIS_KEY}all-users`);
    return updated;
  }

  async activate(id: string) {
    const updated = await prisma.user.update({
      where: { id },
      data: { accountStatus: "ACTIVE" },
    });
    await redis.del(`${ENV.ADMIN_REDIS_KEY}all-users`);
    return updated;
  }


  async reject(id: string) {
    await prisma.user.delete({
      where: { student_id_number: id }
    });

    const cacheKey = `${ENV.ADMIN_REDIS_KEY}unverified-users`

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) await redis.del(cacheKey)

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

  async approveAlumniRequest(studentId: string) {
    const user = await prisma.user.findUnique({
      where: { student_id_number: studentId },
    });

    if (!user) return null;

    // Update upgrade request status to APPROVED
    await prisma.alumniUpgradeRequest.updateMany({
      where: { userId: user.id },
      data: { status: "APPROVED" },
    });

    // Update user role to ALUMNI
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ALUMNI" },
    });

    // Invalidate Redis caches
    await redis.del(`${ENV.ADMIN_REDIS_KEY}alumni-requests`);
    await redis.del(`${ENV.ADMIN_REDIS_KEY}all-users`);

    return updatedUser;
  }

  async rejectAlumniRequest(studentId: string) {
    const user = await prisma.user.findUnique({
      where: { student_id_number: studentId },
    });

    if (!user) return null;

    // Update upgrade request status to REJECTED
    await prisma.alumniUpgradeRequest.updateMany({
      where: { userId: user.id },
      data: { status: "REJECTED" },
    });

    // Invalidate Redis cache
    await redis.del(`${ENV.ADMIN_REDIS_KEY}alumni-requests`);

    return user;
  }
}

