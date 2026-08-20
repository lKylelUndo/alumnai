import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { UpdateProfileInputTypes } from "@/schema/profile";

export class ProfileRepository {
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
              include: {
                fromStudent: {
                  select: {
                    id: true,
                    profile: {
                      select: {
                        fullName: true,
                        profilePicture: true,
                        work_field: true,
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

    const profileWithMentorshipStatus = {
      ...profile,
      mentorshipStatus: mentorship?.status ?? null,
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

