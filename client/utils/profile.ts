import { User } from "@/lib/types/auth"

export type { User }

// Returns default values for the update profile form based on the user's current data.
export const getProfileFormDefaultValues = (user: User | null) => ({
  userId: user?.id || "",
  profilePicture: user?.profile?.profilePicture || "",
  yearLevel: user?.profile?.yearLevel || "",
  graduatedYear: user?.profile?.graduatedYear || "",
  fullName: user?.profile?.fullName || "",
  aboutMe: user?.profile?.aboutMe || "",
  work_field: user?.profile?.work_field || "",
  socialLink: user?.profile?.socialLink || "",
  companyName: user?.profile?.companyName || "",
  current_position: user?.profile?.current_position || "",
  isAvailableForMentorship: user?.profile?.isAvailableForMentorship ?? true,
  isAvailableForCollaboration: user?.profile?.isAvailableForCollaboration ?? true,
  certifications: user?.profile?.certifications || [],
})
