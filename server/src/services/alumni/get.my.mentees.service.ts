import { AlumniRepository } from "@/repositories/alumni.repository";

export const GetMyMenteesService = async (userId: string) => {
  const alumniRepository = new AlumniRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const response = await alumniRepository.getActiveMentees(userId);

    return {
      status: "success",
      message: "Mentees fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetMyMenteesService", error);
    return {
      status: "error",
      message: "Failed to fetch mentees",
      code: 500,
      data: [],
    };
  }
};
