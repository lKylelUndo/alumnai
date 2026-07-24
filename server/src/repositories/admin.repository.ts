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
}
