import { prisma } from "@/lib/prisma";

export class AdminRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: { isAccountVerified: true, id: true },
    });
  }

  async verify(id: string) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        isAccountVerified: true,
      },
    });
  }
}
