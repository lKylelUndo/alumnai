import { Skill } from "@/schema/skill"

export type User = {
  id: string,
  profile: {
    profilePicture: string
    yearLevel: string
    graduatedYear: string
    fullName: string
    aboutMe: string
    work_field: string
    socialLink: string
    companyName: string
    current_position: string
    certifications: Array<{
      id: string
      profileId: string
      name: string
      issuer: string
      fileUrl: string
    }>
    skills: Skill[]
  }
}

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
