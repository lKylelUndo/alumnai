import { prisma } from "@/lib/prisma";
import { AddSkillInputTypes } from "@/schema/skill";

export class SkillRepository {
  async add(data: AddSkillInputTypes) {
    return await prisma.skill.create({
      data,
    });
  }

  async remove() {}
}
