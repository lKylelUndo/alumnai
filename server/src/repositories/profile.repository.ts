import { prisma } from "@/lib/prisma";
import { UpdateProfileInputTypes } from "@/schema/profile";

export class ProfileRepository {
  async all() {
    return await prisma.profile.findMany();
  }

  async findById(userId: string) {
    return await prisma.profile.findUnique({
      where: { userId },
    });
  }

  async update(data: UpdateProfileInputTypes) {
    const { userId, ...restData } = data;
    return await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...restData,
      },
    });
  }
}
