import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class AlumniRepository {
  async findAlumniRequests() {
    const cacheKey = `${ENV.ALUMNI_REDIS_KEY}alumni-requests`;

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

  async approveAlumniRequest(studentId: string) {
    const user = await prisma.user.findUnique({
      where: { student_id_number: studentId },
    });

    if (!user) return null;

    const pendingRequest = await prisma.alumniUpgradeRequest.findFirst({
      where: { userId: user.id, status: "PENDING" },
    });

    if (pendingRequest) {
      await prisma.alumniUpgradeRequest.delete({
        where: { id: pendingRequest.id },
      });
    }

    // Update user role to ALUMNI
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ALUMNI" },
    });

    // Invalidate Redis caches
    await redis.del(`${ENV.ALUMNI_REDIS_KEY}alumni-requests`);
    await redis.del(`${ENV.ADMIN_REDIS_KEY}all-users`);

    return { updatedUser, request: pendingRequest };
  }

  async rejectAlumniRequest(studentId: string) {
    const user = await prisma.user.findUnique({
      where: { student_id_number: studentId },
    });

    if (!user) return null;

    const pendingRequest = await prisma.alumniUpgradeRequest.findUnique({
      where: { userId: user.id },
    });

    if (pendingRequest) {
      await prisma.alumniUpgradeRequest.delete({
        where: { userId: user.id },
      });
    }

    await redis.del(`${ENV.ALUMNI_REDIS_KEY}alumni-requests`);

    return { user, request: pendingRequest };
  }

  async findExistingPendingRequest(userId: string) {
    return await prisma.alumniUpgradeRequest.findFirst({
      where: { userId, status: "PENDING" },
    });
  }

  async createAlumniUpgradeRequest(userId: string, documentUrl: string) {
    const request = await prisma.alumniUpgradeRequest.create({
      data: {
        userId,
        documentUrl,
        status: "PENDING",
      },
    });

    await redis.del(`${ENV.ALUMNI_REDIS_KEY}alumni-requests`);
    return request;
  }
}

