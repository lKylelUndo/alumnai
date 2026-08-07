import { ProfileRepository } from "@/repositories/profile.repository";

export const ViewProfileService = async (profileId: string, userIdWhoRequested: string) => {
  const profileRepository = new ProfileRepository();

  try {
    const profile = await profileRepository.findById(profileId, userIdWhoRequested);

    if (!profile)
      return { status: "error", code: 404, message: "Profile not found" };

    return {
      status: "success",
      code: 200,
      message: "Successfully view a single profile",
      profile,
    };
  } catch (error) {
    console.error("ViewProfileService", error);
    return { status: "error", code: 500, message: "Unable to view a profile" };
  }
};
