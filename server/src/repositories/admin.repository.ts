import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

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
}


