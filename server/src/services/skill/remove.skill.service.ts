import { SkillRepository } from "@/repositories/skill.repository";
import { ProfileRepository } from "@/repositories/profile.repository";

export const RemoveSkillService = async (id: string) => {
  const skillRepository = new SkillRepository();
  const profileRepository = new ProfileRepository();

  try {
    const response = await skillRepository.remove(id);
    if (!response)
      return { status: "error", code: 400, message: "Unable to remove  skill" };

    // Removing a skill changes the view-profile payload — drop cached copies.
    await profileRepository.invalidateCache();

    return { status: "success", code: 200, message: "Successfully remove skill" };
  } catch (error) {
    console.error("RemoveSkillService", error);
    return { status: "error", code: 500, message: "Unable to remove a skill on profile" };
  }
};
