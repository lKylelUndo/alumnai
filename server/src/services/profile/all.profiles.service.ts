import { ProfileRepository } from "@/repositories/profile.repository";

export const AllProfilesService = async () => {
  const profileRepository = new ProfileRepository();

  try {
    const profiles = await profileRepository.all();

    if (Object.keys(profiles).length <= 0)
      return {
        message: "No user profiles at the moment",
        status: "error",
        code: 400,
      };

    return {
      message: "All profiles",
      status: "success",
      code: 200,
      profiles,
    };
  } catch (error) {
    console.error("AllProfilesService", error);
    return { code: 500, status: "error", message: "Unable to get all" };
  }
};
