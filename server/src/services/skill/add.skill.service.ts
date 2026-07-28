import { SkillRepository } from "@/repositories/skill.repository";
import { AddSkillInputTypes } from "@/schema/skill";
import { prisma } from "@/lib/prisma";

export const AddSkillService = async (data: AddSkillInputTypes, userId?: string) => {
  const skillRepository = new SkillRepository();

  try {
    let targetProfileId = data.profileId;

    if (!targetProfileId && userId) {
      const profile = await prisma.profile.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });
      targetProfileId = profile.id;
    }

    if (!targetProfileId) {
      return { status: "error", code: 400, message: "Profile ID could not be determined" };
    }

    const response = await skillRepository.add({
      ...data,
      profileId: targetProfileId,
    });

    if (!response)
      return { status: "error", code: 400, message: "Unable to add skill" };

    return { status: "success", code: 201, message: "Successfully add skill" };
  } catch (error) {
    console.error("AddSkillService", error);
    return { status: "error", code: 500, message: "Unable to add skill on profile" };
  }
};
