import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { SignupInputTypes } from "@/schema/auth/signup.schema";

export class UserRepository {
  async all() {
    const cacheKey = "all-users";

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const users = await prisma.user.findMany();

    await redis.set(cacheKey, JSON.stringify(users), "PX", 1000 * 60 * 5);

    return users;
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: {
          include: {
            skills: true,
            certifications: true,
          },
        },
      }
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      }
    });
  }

  async signup(data: SignupInputTypes) {
    return await prisma.user.create({
      data: {
        student_id_number: data.studentIdNumber,
        email: data.email,
        password: data.password,
      },
    });
  }

  async resetPassword(id: string, password: string) {
    return await prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async findUserWithProfile(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        profile: {
          include: {
            skills: true,
            certifications: true,
          },
        },
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
        student_id_number: true,
        email: true,
        role: true,
        isAccountVerified: true,
      },
    });
  }
}

