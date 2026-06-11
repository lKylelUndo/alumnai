import { ProfileRepository } from "@/repositories/profile.repository";
import { UpdateProfileInputTypes } from "@/schema/profile";

export class ProfileService {
  private profileRepository = new ProfileRepository();

  public viewProfile = async (id: string) => {
    try {
        const profile = await this.profileRepository.findById(id)

        if (!profile)
            return { stats: "error", code: 404, message: "Profile not found"}

        return {
            status: "success",
            code: 200,
            message: "Successfully view a single profile",
            profile
        }
    } catch (error) {
        console.error("ViewProfileService", error);
        return { status: "error", code: 500, message: "Unable to view a profile" }
    }
  };

  public updateProfile = async (data: UpdateProfileInputTypes) => {
    try {
      const profile = await this.profileRepository.update(data)

      if (!profile)
        return { status: "error", code: 400, message: "Failed update profile" };

      return { status: "success", code: 200, message: "Profile updated successfully" };
    } catch (error) {
      console.error("UpdateProfileService", error);
      return { status: "error", code: 500, message: "Unable to update profile"}
    }
  };

  public allProfiles = async () => {
    try {
      const profiles = await this.profileRepository.all();

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
        profiles
      };
    } catch (error) {
      console.error("AllProfileService", error);
      return { code: 500, status: "error", message: "Unable to get all" };
    }
  };
}
