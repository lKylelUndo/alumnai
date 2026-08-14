export type AlumniStudentCardTypes = {
  fromStudentId: string
  mentorshipRecordId: string
  fullName: string
  track: string | null
  yearLevel: string | null
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string | null
  message: string
}