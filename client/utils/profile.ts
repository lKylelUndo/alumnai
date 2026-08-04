import { User } from "@/context/AuthContext"

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
  certifications: user?.profile?.certifications || [],
})
