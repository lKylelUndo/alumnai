import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class StudentRepository {
    // All cache keys this repository owns
    private static CACHE_KEYS = {
        dashboardStats: (userId: string) => `${ENV.STUDENT_REDIS_KEY}student-dashboard-stats-${userId}`,
        mentors: (userId: string) => `${ENV.STUDENT_REDIS_KEY}mentors-${userId}`,
        collaborations: (userId: string) => `${ENV.STUDENT_REDIS_KEY}collaborations-${userId}`,
        collabRequests: (userId: string) => `${ENV.STUDENT_REDIS_KEY}collab-requests-${userId}`,
        findMentors: (userId: string) => `${ENV.STUDENT_REDIS_KEY}find-mentors-${userId}`,
    };

    /**
     * Invalidate student cache keys.
     * Pass specific targets to clear only those, or omit to clear all.
     */
    async invalidateCache(userId: string, targets?: ("dashboard-stats" | "mentors" | "collaborations" | "collab-requests" | "find-mentors")[]) {
        const keyMap: Record<string, string> = {
            "dashboard-stats": StudentRepository.CACHE_KEYS.dashboardStats(userId),
            "mentors": StudentRepository.CACHE_KEYS.mentors(userId),
            "collaborations": StudentRepository.CACHE_KEYS.collaborations(userId),
            "collab-requests": StudentRepository.CACHE_KEYS.collabRequests(userId),
            "find-mentors": StudentRepository.CACHE_KEYS.findMentors(userId),
        };

        const keys = targets
            ? targets.map((t) => keyMap[t]).filter(Boolean)
            : Object.values(keyMap);

        if (keys.length > 0) await redis.del(...keys);
    }

    async getStudentDashboardStats(userId: string) {
        const cacheKey = StudentRepository.CACHE_KEYS.dashboardStats(userId)

        const cached = await redis.get(cacheKey)
        if (cached) return JSON.parse(cached)

        // fetch data from db
        const stats = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                receivedCollaborations: {
                    select: { id: true, status: true },
                },
                sentMentorships: {
                    select: { id: true, status: true },
                },
            }
        })

        const activeCollaborators = stats?.receivedCollaborations.filter((c) => c.status === "ACTIVE").length ?? 0
        const activeMentorships = stats?.sentMentorships.filter((m) => m.status === "ACTIVE").length ?? 0
        const pendingMentorships = stats?.sentMentorships.filter((m) => m.status === "PENDING").length ?? 0
        const pendingCollaborations = stats?.receivedCollaborations.filter((c) => c.status === "PENDING").length ?? 0

        const formatted = {
            activeCollaborators,
            activeMentorships,
            pendingRequests: pendingCollaborations,
            pendingInvites: pendingCollaborations,
        }

        await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5)
        return formatted
    }

    async findMentors(studentUserId: string) {
        const cacheKey = `${ENV.STUDENT_REDIS_KEY}find-mentors-${studentUserId}`;

        // try cache first
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        // fallback to DB — fetch all active alumni with profiles and skills
        const mentors = await prisma.user.findMany({
            where: {
                role: "ALUMNI",
                accountStatus: "ACTIVE",
            },
            select: {
                id: true,
                profile: {
                    select: {
                        fullName: true,
                        profilePicture: true,
                        aboutMe: true,
                        work_field: true,
                        companyName: true,
                        current_position: true,
                        isAvailableForMentorship: true,
                        skills: {
                            select: {
                                name: true,
                                level: true,
                                description: true,
                            },
                        },
                    },
                },
                receivedMentorships: {
                    where: { fromStudentId: studentUserId },
                    select: { id: true, status: true },
                },
                receivedRecognitions: {
                    select: { id: true },
                },
            },
        });

        const formatted = mentors.map((mentor) => {
            const hasInvite = mentor.receivedMentorships.length > 0;

            return {
                id: mentor.id,
                name: mentor.profile?.fullName || "Alumni Mentor",
                aboutMe: mentor.profile?.aboutMe || "No bio available.",
                profilePicture: mentor.profile?.profilePicture ?? null,
                alreadyInvited: hasInvite,
                work_field: mentor.profile?.work_field || "Field not specified",
                companyName: mentor.profile?.companyName || null,
                current_position: mentor.profile?.current_position || null,
                isAvailableForMentorship: mentor.profile?.isAvailableForMentorship ?? null,
                recognitionCount: mentor.receivedRecognitions?.length ?? 0,
                skills: (mentor.profile?.skills ?? []).map((skill) => ({
                    name: skill.name || "General",
                    level: skill.level ?? 0,
                    description: skill.description ?? "",
                })),
            };
        });

        // cache for 2 minutes
        await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 2);

        return formatted;
    }
}

    
