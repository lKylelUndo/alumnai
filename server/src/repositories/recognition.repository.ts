import { prisma } from "@/lib/prisma";

export class RecognitionRepository {
  async findByStudentAndAlumni(fromStudentId: string, toAlumniId: string) {
    return await prisma.recognition.findFirst({
      where: {
        fromStudentId,
        toAlumniId,
      },
      select: {
        id: true,
        fromStudentId: true,
        toAlumniId: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.recognition.findUnique({
      where: { id },
      include: {
        fromStudent: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        toAlumni: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    });
  }

  async upsert(fromStudentId: string, toAlumniId: string, message: string) {
    const existing = await this.findByStudentAndAlumni(fromStudentId, toAlumniId);

    if (existing) {
      return await prisma.recognition.update({
        where: { id: existing.id },
        data: {
          message,
          updatedAt: new Date(),
        },
      });
    }

    return await prisma.recognition.create({
      data: {
        fromStudentId,
        toAlumniId,
        message,
      },
    });
  }

  async getRecognitionsForAlumni(toAlumniId: string) {
    return await prisma.recognition.findMany({
      where: { toAlumniId },
      include: {
        fromStudent: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
                current_position: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
