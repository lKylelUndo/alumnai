import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class StudentRepository {
    async getStudentDashboardStats(userId: string) {
        const cacheKey = `${ENV.STUDENT_REDIS_KEY}student-dashboard-stats-${userId}`

        const cached = await redis.get(cacheKey)
        if (cached) return JSON.parse(cached)

        // fetch data from db
        const stats = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                sentCollaborations: {
                    select: { id: true, status: true },
                },
                receivedMentorships: {
                    select: { id: true, status: true },
                },
            }
        })

        const activeCollaborators = stats?.sentCollaborations.filter((c) => c.status === "ACTIVE").length ?? 0
        const activeMentorships = stats?.receivedMentorships.filter((m) => m.status === "ACTIVE").length ?? 0
        const pendingMentorships = stats?.receivedMentorships.filter((m) => m.status === "PENDING").length ?? 0
        const pendingCollaborations = stats?.sentCollaborations.filter((c) => c.status === "PENDING").length ?? 0

        const formatted = {
            activeCollaborators,
            activeMentorships,
            pendingRequests: pendingMentorships + pendingCollaborations,
        }

        await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5)
        return formatted
    }
}
    
