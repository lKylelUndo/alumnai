import { ProfileRepository } from "@/repositories/profile.repository";

export class ProfileService {
  private profileRepository = new ProfileRepository();

  public viewProfile = async () => {};

  public updateProfile = async () => {};

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
