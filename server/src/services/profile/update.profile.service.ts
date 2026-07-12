import { ProfileRepository } from "@/repositories/profile.repository";
import { UpdateProfileInputTypes } from "@/schema/profile";
import { uploadImage } from "@/lib/cloudinary";

export const UpdateProfileService = async (data: UpdateProfileInputTypes) => {
  const profileRepository = new ProfileRepository();

  try {
    if (data.profilePicture) {
      const uploadResult = await uploadImage(data.profilePicture);
      data.profilePicture = uploadResult.secure_url;
    }

    const profile = await profileRepository.update(data);

    if (!profile)
      return { status: "error", code: 400, message: "Failed update profile" };

    return { status: "success", code: 200, message: "Profile updated successfully" };
  } catch (error) {
    console.error("UpdateProfileService", error);
    return { status: "error", code: 500, message: "Unable to update profile" };
  }
};
