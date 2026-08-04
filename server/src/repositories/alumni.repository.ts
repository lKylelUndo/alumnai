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
    await redis.del(`${ENV.ALUMNI_REDIS_KEY}alumni-requests`);
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
    await redis.del(`${ENV.ALUMNI_REDIS_KEY}alumni-requests`);

    return user;
  }
}
