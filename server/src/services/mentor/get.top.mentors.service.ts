import { MentorRepository } from "@/repositories/mentor.repository";

export const GetTopMentorsService = async () => {
  const mentorRepository = new MentorRepository();

  try {
    const mentors = await mentorRepository.findTopMentors();

    return {
      code: 200,
      status: "success",
      message: "Fetched top mentors",
      data: { mentors },
    };
  } catch (error) {
    console.error("GetTopMentorsService", error);
    return { code: 500, status: "error", message: "Unable to fetch top mentors" };
  }
};
