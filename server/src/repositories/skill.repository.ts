import { prisma } from "@/lib/prisma";
import { AddSkillInputTypes } from "@/schema/skill";

export class SkillRepository {
  async add(data: AddSkillInputTypes) {
    return await prisma.skill.create({
      data,
    });
  }

  async remove(id: string) {
    return await prisma.skill.delete({
        where: { id }
    })
  }

  async find() {
    
  }
}
