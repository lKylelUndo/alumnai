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

    
