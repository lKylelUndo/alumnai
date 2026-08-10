import { SkillRepository } from "@/repositories/skill.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { AddSkillInputTypes } from "@/schema/skill";

export const AddSkillService = async (data: AddSkillInputTypes, userId?: string) => {
  const skillRepository = new SkillRepository();
  const profileRepository = new ProfileRepository();

  try {
    let targetProfileId = data.profileId;
    let effectiveUserId = userId;

    if (!targetProfileId && userId) {
      const profile = await profileRepository.getOrCreateProfileByUserId(userId);
      targetProfileId = profile.id;
    } else if (targetProfileId && !effectiveUserId) {
      const profile = await profileRepository.findByPk(targetProfileId);
      if (profile) effectiveUserId = profile.userId;
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

    // Clear skill gap analysis cache for user via repository
    if (effectiveUserId) {
      await skillRepository.invalidateSkillGapCache(effectiveUserId);
    }

    return { status: "success", code: 201, message: "Successfully add skill" };
  } catch (error) {
    console.error("AddSkillService", error);
    return { status: "error", code: 500, message: "Unable to add skill on profile" };
  }
};
