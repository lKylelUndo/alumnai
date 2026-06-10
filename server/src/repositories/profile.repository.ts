import { prisma } from "@/lib/prisma";

export class ProfileRepository {
  async all() {
    return await prisma.profile.findMany();
  }

  async findById(userId: string) {
    return await prisma.profile.findUnique({
      where: { userId },
    });
  }
}
