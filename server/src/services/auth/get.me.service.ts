import { UserRepository } from "@/repositories/user.repository";
import { RoleType } from "@/generated/prisma/enums";

export const GetMeService = async (userId: string) => {
  const userRepository = new UserRepository();

  try {
    const user = await userRepository.findUserWithProfile(userId);

    if (!user)
      return { code: 404, status: "error", message: "User not found" };

    // each role exposes only its own availability flag
    const { profile } = user;
    if (profile) {
      if (user.role === RoleType.STUDENT) {
        const { isAvailableForMentorship: _omitMentorship, ...studentProfile } = profile;
        return { code: 200, status: "success", data: { user: { ...user, profile: studentProfile } } };
      }
      const { isAvailableForCollaboration: _omitCollab, ...restProfile } = profile;
      return { code: 200, status: "success", data: { user: { ...user, profile: restProfile } } };
    }

    return { code: 200, status: "success", data: { user } };
  } catch (error) {
    console.error("GetMeServiceError:", error);
    return { code: 500, status: "error", message: "GetMeServiceError", error };
  }
};
