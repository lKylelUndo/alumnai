import { RecognitionRepository } from "@/repositories/recognition.repository";

export const GetMentorRecognitionService = async (fromStudentId: string, toAlumniId: string) => {
  const recognitionRepository = new RecognitionRepository();

  try {
    if (!fromStudentId || !toAlumniId) {
      return {
        status: "error",
        code: 400,
        message: "Student ID and Alumni ID are required",
        data: null,
      };
    }

    const recognition = await recognitionRepository.findByStudentAndAlumni(
      fromStudentId,
      toAlumniId
    );

    return {
      status: "success",
      code: 200,
      message: "Recognition fetched successfully",
      data: recognition,
    };
  } catch (error) {
    console.error("GetMentorRecognitionService error:", error);
    return {
      status: "error",
      code: 500,
      message: "Unable to fetch recognition",
      data: null,
    };
  }
};
