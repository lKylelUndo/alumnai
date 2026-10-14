export type ProfileChecklistItem = {
  key: string;
  label: string;
};

type ChecklistProfile = {
  profilePicture?: string | null;
  aboutMe?: string | null;
  graduatedYear?: string | null;
  current_position?: string | null;
  skills?: Array<unknown> | null;
} | null | undefined;

/**
 * Returns the profile pieces still missing for the given role.
 * Empty array means the profile is complete and no nudge should render.
 */
export function getProfileChecklist(
  profile: ChecklistProfile,
  role: "STUDENT" | "ALUMNI" | string
): ProfileChecklistItem[] {
  if (!profile) return [{ key: "profile", label: "Create your profile" }];

  const missing: ProfileChecklistItem[] = [];

  if (!profile.profilePicture)
    missing.push({ key: "photo", label: "Add a profile photo" });
  if (!profile.aboutMe?.trim())
    missing.push({ key: "bio", label: "Write a short bio" });
  if (!profile.skills || profile.skills.length === 0)
    missing.push({ key: "skills", label: "Add at least one skill" });

  if (role === "ALUMNI") {
    if (!profile.graduatedYear?.trim())
      missing.push({ key: "graduatedYear", label: "Add your graduation year" });
    if (!profile.current_position?.trim())
      missing.push({ key: "position", label: "Add your current position" });
  }

  return missing;
}
