import { prisma } from "@/lib/prisma";
import { SignupInputTypes } from "@/schema/auth/signup.schema";

export class UserRepository {
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

  async findByStudentIdNumber(studentIdNumber: string) {
    return await prisma.user.findUnique({
      where: {
        student_id_number: studentIdNumber,
      },
      select: {
        id: true,
      },
    });
  }

  async signup(data: SignupInputTypes) {
    return await prisma.user.create({
      data: {
        student_id_number: data.studentIdNumber,
        email: data.email,
        password: data.password,
        // Seed the profile now so admin lists show the registrant's name
        // instead of "Unknown" before they complete their profile.
        profile: {
          create: {
            fullName: data.name,
          },
        },
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
        // This is the alumni's own /me payload: deliberately NOT filtered by
        // isVisible so the client can render the visibility toggle. `include`
        // returns every scalar field, so each recognition carries its
        // `isVisible` flag along with the relation below.
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
                        isAvailableForMentorship: true,
                        isAvailableForCollaboration: true,
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

