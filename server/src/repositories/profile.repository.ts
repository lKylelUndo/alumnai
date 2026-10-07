import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { RoleType } from "@/generated/prisma/enums";
import { UpdateProfileInputTypes } from "@/schema/profile";

export class ProfileRepository {
  /**
   * Invalidate profile-related caches.
   * Clears the global profiles list and all view-profile caches.
   */
  async invalidateCache() {
    await redis.del("all-profiles");
    // Clear all view-profile caches (pattern-based)
    const viewKeys = await redis.keys("viewprofile:v2:*");
    if (viewKeys.length > 0) await redis.del(...viewKeys);
  }

  async all() {
    const cacheKey = "all-profiles";

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to db
    const profiles = await prisma.profile.findMany({
      include: {
        skills: true,
        certifications: true,
      },
    });

    await redis.set(cacheKey, JSON.stringify(profiles), "PX", 1000 * 60 * 5);

    return profiles;
  }

  async findById(profileId: string, userIdWhoRequested: string) {
    const cacheKey = `viewprofile:v2:${userIdWhoRequested}:${profileId}`;

    // Owner-aware recognition visibility: every other viewer sees only
    // recognitions the alumni chose to show; the alumni viewing their OWN
    // profile additionally sees their hidden ones so they can toggle them.
    // The ownership branch is only ever added for the profile owner, so a
    // student/admin viewer can never receive a hidden recognition.
    const isOwnProfile = profileId === userIdWhoRequested;

    // try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // fallback to db
    const profile = await prisma.profile.findUnique({
      where: { userId: profileId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            student_id_number: true,
            role: true,
            receivedRecognitions: {
              // Privacy: only visible recognitions ever leave the system,
              // except that the owner sees their own hidden ones too (the
              // ownership clause exists only when viewing your own profile).
              where: isOwnProfile
                ? { OR: [{ isVisible: true }, { toAlumniId: userIdWhoRequested }] }
                : { isVisible: true },
              include: {
                fromStudent: {
                  select: {
                    id: true,
                    profile: {
                      select: {
                        fullName: true,
                        profilePicture: true,
                        work_field: true,
                        isAvailableForMentorship: true,
                        isAvailableForCollaboration: true,
                      },
                    },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        skills: true,
        certifications: true,
      },
    });

    if (!profile) return null;

    const mentorship = await prisma.mentorship.findFirst({
      where: {
        fromStudentId: userIdWhoRequested,
        toAlumniId: profileId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
      orderBy: { updatedAt: "desc" },
      select: { status: true },
    });

    const alreadyInvitedCollaboration = await prisma.collaboration.findFirst({
      where: {
        fromAlumniId: userIdWhoRequested,
        toStudentId: profileId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
      select: { id: true },
    });

    const viewer = await prisma.user.findUnique({
      where: { id: userIdWhoRequested },
      select: { role: true },
    });

    const pendingMentorship =
      viewer?.role === RoleType.ALUMNI
        ? await prisma.mentorship.findFirst({
            where: {
              fromStudentId: profileId,
              toAlumniId: userIdWhoRequested,
              status: "PENDING",
            },
            select: {
              id: true,
              fromStudentId: true,
              message_details: true,
              status: true,
            },
          })
        : null;

    const profileWithMentorshipStatus = {
      ...profile,
      mentorshipStatus: mentorship?.status ?? null,
      alreadyInvitedCollaboration: alreadyInvitedCollaboration !== null,
      pendingMentorshipRequest: pendingMentorship
        ? {
            mentorshipRecordId: pendingMentorship.id,
            fromStudentId: pendingMentorship.fromStudentId,
            message: pendingMentorship.message_details,
            status: pendingMentorship.status,
          }
        : null,
    };

    await redis.set(cacheKey, JSON.stringify(profileWithMentorshipStatus), "PX", 1000 * 60 * 2);

    return profileWithMentorshipStatus;
  }

  async update(data: UpdateProfileInputTypes) {
    const { userId, certifications, ...restData } = data;
    
    // upsert the profile
    return await prisma.profile.upsert({
      where: { userId },
      update: restData,
      create: {
        userId,
        ...restData,
      },
    });
  }

  async getOrCreateProfileByUserId(userId: string) {
    return await prisma.profile.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async findByPk(id: string) {
    return await prisma.profile.findUnique({
      where: { id },
      select: { userId: true },
    });
  }

  async matchSkill(skills: string[]) {
    return await prisma.profile.findMany({
      where: {
        user: {
          role: "STUDENT",
          accountStatus: "ACTIVE",
        },
        skills: {
          some: {
            name: {
              in: skills,
            },
          },
        },
      },
      include: {
        skills: true,
        user: true,
      },
    });
  }
}

