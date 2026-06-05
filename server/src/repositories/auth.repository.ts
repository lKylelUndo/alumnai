import { prisma } from "@/lib/prisma";
import { SignupInputTypes } from "@/schema/auth/signup.schema";

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
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
}
