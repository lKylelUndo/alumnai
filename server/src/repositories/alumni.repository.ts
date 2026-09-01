import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { formatStudentCard } from "@/utils/format-student-card";

export class AlumniRepository {
  // All cache keys this repository owns
  private static CACHE_KEYS = {
    alumniRequests: `${ENV.ALUMNI_REDIS_KEY}alumni-requests`,
    dashboardStats: (userId: string) => `${ENV.ALUMNI_REDIS_KEY}dashboard-stats-${userId}`,
    mentees: (userId: string) => `${ENV.ALUMNI_REDIS_KEY}mentees-${userId}`,
    collaborations: (userId: string) => `${ENV.ALUMNI_REDIS_KEY}collaborations-${userId}`,
    mentorshipRequests: (userId: string) => `${ENV.ALUMNI_REDIS_KEY}mentorship-requests-${userId}`,
    findCollaborators: (userId: string) => `${ENV.ALUMNI_REDIS_KEY}find-collaborators-${userId}`,
  };

  /**
   * Invalidate alumni cache keys.
   * Pass specific targets to clear only those, or omit to clear all.
   */
  async invalidateCache(userId: string, targets?: ("alumni-requests" | "dashboard-stats" | "mentees" | "collaborations" | "mentorship-requests" | "find-collaborators")[]) {
    const keyMap: Record<string, string> = {
      "alumni-requests": AlumniRepository.CACHE_KEYS.alumniRequests,
      "dashboard-stats": AlumniRepository.CACHE_KEYS.dashboardStats(userId),
      "mentees": AlumniRepository.CACHE_KEYS.mentees(userId),
      "collaborations": AlumniRepository.CACHE_KEYS.collaborations(userId),
      "mentorship-requests": AlumniRepository.CACHE_KEYS.mentorshipRequests(userId),
      "find-collaborators": AlumniRepository.CACHE_KEYS.findCollaborators(userId),
    };

    const keys = targets
      ? targets.map((t) => keyMap[t]).filter(Boolean)
      : Object.values(keyMap);

    if (keys.length > 0) await redis.del(...keys);
  }

  async findAlumniRequests() {
    const cacheKey = AlumniRepository.CACHE_KEYS.alumniRequests;

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

    return { user, request: pendingRequest };
  }

  async findExistingPendingRequest(userId: string) {
    return await prisma.alumniUpgradeRequest.findFirst({
      where: { userId, status: "PENDING" },
    });
  }

  async createAlumniUpgradeRequest(userId: string, documentUrl: string) {
    return await prisma.alumniUpgradeRequest.create({
      data: {
        userId,
        documentUrl,
        status: "PENDING",
      },
    });
  }

  async getDashboardStats(userId: string) {
    const cacheKey = `${ENV.ALUMNI_REDIS_KEY}dashboard-stats-${userId}`

    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    // fallback fetch data from db
    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        sentCollaborations: {
          select: { id: true, status: true },
        },
        receivedMentorships: {
          select: { id: true, status: true },
        },
      },
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

  async findStudents(alumniUserId: string) {
    const cacheKey = `${ENV.ALUMNI_REDIS_KEY}find-collaborators-${alumniUserId}`;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to DB — fetch all active students with profiles and skills
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
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
        receivedCollaborations: {
          where: { fromAlumniId: alumniUserId },
          select: { id: true, status: true },
        },
      },
    });

    const formatted = students.map((student) => {
      const hasInvite = student.receivedCollaborations.length > 0;

      return {
        id: student.id,
        name: student.profile?.fullName || "Student User",
        aboutMe: student.profile?.aboutMe || "No bio available.",
        profilePicture: student.profile?.profilePicture ?? null,
        alreadyInvited: hasInvite,
        work_field: student.profile?.work_field || null,
        current_position: student.profile?.current_position || null,
        skills: (student.profile?.skills ?? []).map((skill) => ({
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

  async getActiveMentees(alumniUserId: string) {
    const cacheKey = `${ENV.ALUMNI_REDIS_KEY}mentees-${alumniUserId}`

    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const mentorships = await prisma.mentorship.findMany({
      where: {
        toAlumniId: alumniUserId,
        status: "ACTIVE",
      },
      include: {
        fromStudent: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
                yearLevel: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const formatted = mentorships.map((mentorship) =>
      formatStudentCard(mentorship.fromStudent.id, mentorship.fromStudent.profile, {
        recordId: mentorship.id,
        status: mentorship.status,
        message: mentorship.message_details,
      }),
    )

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5)

    return formatted
  }

  async getActiveCollaborations(alumniUserId: string) {
    const cacheKey = `${ENV.ALUMNI_REDIS_KEY}collaborations-${alumniUserId}`

    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const collaborations = await prisma.collaboration.findMany({
      where: {
        fromAlumniId: alumniUserId,
        status: "ACTIVE",
      },
      include: {
        toStudent: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
                yearLevel: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const formatted = collaborations.map((collaboration) =>
      formatStudentCard(collaboration.toStudent.id, collaboration.toStudent.profile, {
        recordId: collaboration.id,
        status: collaboration.status,
        message: collaboration.message_details,
        idKey: "collaborationId",
      }),
    )

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5)

    return formatted
  }

  async getPendingMentorshipRequests(alumniUserId: string) {
    const cacheKey = `${ENV.ALUMNI_REDIS_KEY}mentorship-requests-${alumniUserId}`

    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const requests = await prisma.mentorship.findMany({
      where: {
        toAlumniId: alumniUserId,
        status: "PENDING",
      },
      include: {
        fromStudent: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
                yearLevel: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = requests.map((request) =>
      formatStudentCard(request.fromStudent.id, request.fromStudent.profile, {
        recordId: request.id,
        status: request.status,
        message: request.message_details,
      }),
    )

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5)

    return formatted
  }
}

