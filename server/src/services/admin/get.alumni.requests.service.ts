import { notifyRole } from "@/lib/socket";
import { AlumniRepository } from "@/repositories/alumni.repository";

export const GetAlumniRequestsService = async () => {
  const alumniRepository = new AlumniRepository();

  try {
    const requests = await alumniRepository.findAlumniRequests();

    return {
      code: 200,
      status: "success",
      message: "Fetched alumni upgrade requests",
      data: { requests },
    };
  } catch (error) {
    console.error("GetAlumniRequestsService", error);
    return { code: 500, status: "error", message: "Unable to fetch alumni requests" };
  }
};
