import type { SavedSkill } from "@/schema/profile"
import type { AddSkillInput } from "@/schema/skill"

export type User = {
  id: string,
  profile: {
    profilePicture: string
    yearLevel: string
    graduatedYear: string
    fullName: string
    aboutMe: string
    work_field: string
    coreSkills: string[]
    socialLink: string
    companyName: string
    current_position: string
    certifications: string[]
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
  coreSkills: user?.profile?.coreSkills || [],
  socialLink: user?.profile?.socialLink || "",
  companyName: user?.profile?.companyName || "",
  current_position: user?.profile?.current_position || "",
  certifications: user?.profile?.certifications || [],
})

/**
 * Merges a newly saved hard skill and core skills list into the existing savedSkills list.
 * This overwrites/updates the hard skill if it matches by name, filters out older core/soft
 * skills, and appends the new list of core skills as SOFT_SKILL payloads.
 */
export function mergeSavedSkills(prevSkills: SavedSkill[], newHardSkill: SavedSkill, newCoreSkills: string[]): SavedSkill[] {
  // Filter out previous soft skills because newCoreSkills represents the complete list of core skills
  const hardSkills = prevSkills.filter((s) => s.type === "HARD_SKILL")

  // Update or add the new hard skill (newHardSkill)
  const existsIndex = hardSkills.findIndex((s) => s.name === newHardSkill.name)
  let updatedHardSkills = [...hardSkills]
  if (existsIndex >= 0) {
    updatedHardSkills[existsIndex] = newHardSkill
  } else {
    updatedHardSkills.push(newHardSkill)
  }

  // Map the new core skills list to SOFT_SKILL payloads
  const newSoftSkills = newCoreSkills.map((skillName) => ({
    name: skillName,
    type: "SOFT_SKILL" as const,
    description: "",
  }))

  return [...updatedHardSkills, ...newSoftSkills]
}

/**
 * Submits all saved skills to the database by attaching the profileId and calling the addSkill function.
 */
export async function saveProfileSkills(savedSkills: SavedSkill[], profileId: string, addSkillFn: (skill: AddSkillInput) => Promise<any>): Promise<void> {
  if (savedSkills.length === 0) return

  const skillsToSubmit = savedSkills.map((skill) => ({
    ...skill,
    profileId,
  }))

  await Promise.all(skillsToSubmit.map((skill) => addSkillFn(skill)))
}
