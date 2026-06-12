import { prisma } from "@/lib/prisma";
import { SignupInputTypes } from "@/schema/auth/signup.schema";

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
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
      data: { password }
    })
  }
}
