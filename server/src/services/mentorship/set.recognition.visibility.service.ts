import { RecognitionRepository } from "@/repositories/recognition.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { MentorshipRepository } from "@/repositories/mentorship.repository";

export const SetRecognitionVisibilityService = async (
  recognitionId: string,
  alumniUserId: string,
  isVisible: boolean
) => {
  const recognitionRepository = new RecognitionRepository();
  const profileRepository = new ProfileRepository();
  const mentorshipRepository = new MentorshipRepository();

  try {
    // Scoped to the receiving alumni: any other user matches nothing -> 404.
    const recognition = await recognitionRepository.setVisibility(
      recognitionId,
      alumniUserId,
      isVisible
    );

    if (!recognition) {
      return { status: "error", code: 404, message: "Recognition not found" };
    }

    // Best-effort cache invalidation: the profile view and the student
    // mentor lists can hold recognitions. A dead cache must never fail the
    // request that triggered it (entries expire via TTL anyway).
    try {
      await Promise.all([
        profileRepository.invalidateCache(),
        mentorshipRepository.invalidateRecognitionCaches(),
      ]);
    } catch (error) {
      console.warn(
        "SetRecognitionVisibilityService cache invalidation failed:",
        error
      );
    }

    return {
      status: "success",
      code: 200,
      message: "Recognition visibility updated successfully",
      data: { id: recognition.id, isVisible: recognition.isVisible },
    };
  } catch (error) {
    console.error("SetRecognitionVisibilityService error:", error);
    return {
      status: "error",
      code: 500,
      message: "Unable to update recognition visibility",
    };
  }
};
