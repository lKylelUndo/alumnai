import { UserRepository } from "@/repositories/user.repository";

export const GetMeService = async (userId: string) => {
  const userRepository = new UserRepository();

  try {
    const user = await userRepository.findUserWithProfile(userId);

    if (!user) 
      return { code: 404, status: "error", message: "User not found" };
    
    return { code: 200, status: "success", data: { user } };
  } catch (error) {
    console.error("GetMeServiceError:", error);
    return { code: 500, status: "error", message: "GetMeServiceError", error };
  }
};
