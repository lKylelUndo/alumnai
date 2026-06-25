import { ProfileRepository } from "@/repositories/profile.repository";
import { UpdateProfileInputTypes } from "@/schema/profile";

export const UpdateProfileService = async (data: UpdateProfileInputTypes) => {
  const profileRepository = new ProfileRepository();

  try {
    const profile = await profileRepository.update(data);

    if (!profile)
      return { status: "error", code: 400, message: "Failed update profile" };

    return { status: "success", code: 200, message: "Profile updated successfully" };
  } catch (error) {
    console.error("UpdateProfileService", error);
    return { status: "error", code: 500, message: "Unable to update profile" };
  }
};
