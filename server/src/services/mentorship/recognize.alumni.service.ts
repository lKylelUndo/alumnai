import { ENV } from "@/config/env";
import { redis } from "@/lib/redis";
import { RecognitionRepository } from "@/repositories/recognition.repository";
import { RecognizeAlumniTypes } from "@/schema/mentorship";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";

export const RecognizeAlumniService = async (
  fromStudentId: string,
  data: RecognizeAlumniTypes
) => {
  const recognitionRepository = new RecognitionRepository();

  try {
    if (!fromStudentId) {
      return { status: "error", code: 400, message: "Student ID is required" };
    }

    if (fromStudentId === data.toAlumniId) {
      return {
        status: "error",
        code: 400,
        message: "You cannot recognize yourself",
      };
    }

    const recognition = await recognitionRepository.upsert(
      fromStudentId,
      data.toAlumniId,
      data.message.trim()
    );

    if (!recognition) {
      return {
        status: "error",
        code: 400,
        message: "Failed to submit recognition",
      };
    }

    // Invalidate caches
    await Promise.all([
      redis.del(`${ENV.STUDENT_REDIS_KEY}mentors-${fromStudentId}`),
      invalidateStudentDashboardCache(fromStudentId),
      invalidateAlumniDashboardCache(data.toAlumniId),
    ]);

    return {
      status: "success",
      code: 200,
      message: "Recognition saved successfully",
      data: recognition,
    };
  } catch (error) {
    console.error("RecognizeAlumniService error:", error);
    return {
      status: "error",
      code: 500,
      message: "Unable to save recognition",
    };
  }
};
