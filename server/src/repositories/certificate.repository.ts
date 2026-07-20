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
}