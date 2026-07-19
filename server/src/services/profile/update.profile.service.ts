import { ProfileRepository } from "@/repositories/profile.repository";
import { CertificateRepository } from "@/repositories/certificate.repository";
import { UpdateProfileInputTypes } from "@/schema/profile";
import { uploadImage } from "@/lib/cloudinary";

export const UpdateProfileService = async (data: UpdateProfileInputTypes) => {
  const profileRepository = new ProfileRepository();
  const certificateRepository = new CertificateRepository();

  try {
    if (data.profilePicture && data.profilePicture.startsWith("data:")) {
      const uploadResult = await uploadImage(data.profilePicture);
      data.profilePicture = uploadResult.secure_url;
    }

    const profile = await profileRepository.update(data);

    if (!profile)
      return { status: "error", code: 400, message: "Failed update profile" };

    // Sync certifications in the database
    if (data.certifications) {
      const incomingCerts = data.certifications;
      
      // Upload any new certificate files to Cloudinary
      for (const cert of incomingCerts) {
        if (cert.fileBase64 && cert.fileBase64.startsWith("data:")) {
          const uploadResult = await uploadImage(cert.fileBase64, 'alumnai-certificates');
          cert.fileUrl = uploadResult.secure_url;
        }
      }

      // Get existing certifications for this profile
      const existingCerts = await certificateRepository.findByProfileId(profile.id);

      const incomingIds = incomingCerts.map(c => c.id).filter(Boolean) as string[];

      // Delete certifications that are no longer in the incoming list
      const toDelete = existingCerts.filter(c => !incomingIds.includes(c.id));
      if (toDelete.length > 0) {
        await certificateRepository.deleteMany(toDelete.map(c => c.id));
      }

      // Upsert the remaining/new certifications
      for (const cert of incomingCerts) {
        if (cert.id) {
          // Update existing
          await certificateRepository.update(cert.id, {
            name: cert.name,
            issuer: cert.issuer,
            fileUrl: cert.fileUrl || "",
          });
        } else {
          // Create new
          await certificateRepository.create({
            profileId: profile.id,
            name: cert.name,
            issuer: cert.issuer,
            fileUrl: cert.fileUrl || "",
          });
        }
      }
    }

    return { status: "success", code: 200, message: "Profile updated successfully" };
  } catch (error) {
    console.error("UpdateProfileService", error);
    return { status: "error", code: 500, message: "Unable to update profile" };
  }
};
