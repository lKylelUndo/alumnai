import { prisma } from "@/lib/prisma";

export class RecognitionRepository {
  async findByStudentAndAlumni(fromStudentId: string, toAlumniId: string, onlyVisible = false) {
    return await prisma.recognition.findFirst({
      where: onlyVisible
        ? { fromStudentId, toAlumniId, isVisible: true }
        : { fromStudentId, toAlumniId },
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

  /**
   * Toggle visibility of a recognition. The update is scoped to BOTH the
   * recognition id and the receiving alumni's user id, so anyone other than
   * the recipient matches no rows. Returns the updated row, or null when it
   * does not exist (or is not owned by this alumni).
   */
  async setVisibility(recognitionId: string, alumniUserId: string, isVisible: boolean) {
    const result = await prisma.recognition.updateMany({
      where: {
        id: recognitionId,
        toAlumniId: alumniUserId,
      },
      data: { isVisible },
    });

    if (result.count === 0) return null;

    return await prisma.recognition.findUnique({
      where: { id: recognitionId },
      select: {
        id: true,
        isVisible: true,
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
