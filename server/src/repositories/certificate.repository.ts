import { prisma } from "@/lib/prisma";

export class CertificateRepository {
  async findByProfileId(profileId: string) {
    return await prisma.certification.findMany({
      where: { profileId },
    });
  }

  async deleteMany(ids: string[]) {
    return await prisma.certification.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async update(id: string, data: { name: string; issuer: string; fileUrl: string }) {
    return await prisma.certification.update({
      where: { id },
      data,
    });
  }

  async create(data: { profileId: string; name: string; issuer: string; fileUrl: string }) {
    return await prisma.certification.create({
      data,
    });
  }

  /**
   * Update visibility, scoped to the owning user through the profile.
   * Returns null when the row does not exist (or is not owned by this user).
   */
  async setVisibility(certificationId: string, userId: string, isVisible: boolean) {
    const result = await prisma.certification.updateMany({
      where: {
        id: certificationId,
        profile: { userId },
      },
      data: { isVisible },
    });

    if (result.count === 0) return null;

    return await prisma.certification.findUnique({
      where: { id: certificationId },
      select: { id: true, isVisible: true },
    });
  }

  /**
   * Delete a single certification, scoped to the owning user through the
   * profile. Returns the deleted row, or null when it does not exist
   * (or is not owned by this user).
   */
  async deleteOne(certificationId: string, userId: string) {
    const target = await prisma.certification.findFirst({
      where: {
        id: certificationId,
        profile: { userId },
      },
      select: { id: true },
    });

    if (!target) return null;

    return await prisma.certification.delete({
      where: { id: certificationId },
    });
  }
}