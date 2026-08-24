type StudentProfile = {
  fullName?: string | null
  profilePicture?: string | null
  work_field?: string | null
  yearLevel?: string | null
} | null

export function formatTrack(workField?: string | null) {
  if (!workField) return "GENERAL"

  return workField
    .replace(/development/gi, "")
    .replace(/&/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(" ")
    .toUpperCase()
}

export function formatYearLevel(yearLevel?: string | null) {
  if (!yearLevel) return "N/A"
  return yearLevel.toUpperCase()
}

export function formatStudentCard(
  studentId: string,
  profile: StudentProfile,
  extra: {
    recordId: string
    status: string
    message?: string
    idKey?: "collaborationId" | "mentorshipRecordId"
  },
) {
  const key = extra.idKey ?? "mentorshipRecordId"

  return {
    fromStudentId: studentId,
    [key]: extra.recordId,
    fullName: profile?.fullName || "Student User",
    track: formatTrack(profile?.work_field),
    yearLevel: formatYearLevel(profile?.yearLevel),
    status: extra.status,
    profilePicture: profile?.profilePicture ?? null,
    message: extra.message,
  }
}
